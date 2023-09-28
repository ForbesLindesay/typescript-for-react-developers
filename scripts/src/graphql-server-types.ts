import {stat, mkdir} from 'fs/promises';
import {join, relative, resolve, dirname} from 'path';

import {InputValueDefinitionNode, TypeNode} from 'graphql';
import {param, parse, startChain} from 'parameter-reducers';

import {isGraphQlValidationError, readGraphQlSchemaFile} from './utils/graphql';
import watchFile from './utils/watchFile';
import {writeTypeScript} from './utils/codegen';

function dependency(specifiers: string, name: string) {
  return `import ${specifiers} from "${name}"`;
}

interface SchemaContext {
  readonly enumNames: ReadonlySet<string>;
  readonly inputObjectNames: ReadonlySet<string>;
  readonly objectTypeNames: ReadonlySet<string>;
  readonly unionTypeNames: ReadonlySet<string>;
  readonly interfaceTypeNames: ReadonlySet<string>;
}

async function run(schemaFileName: string, schemaDirectory: string, generateResolvers: boolean) {
  const {source, documentNode} = await readGraphQlSchemaFile(schemaFileName);
  const definitions = documentNode.definitions
    .slice()
    .sort((a: {kind: string; name?: null | {value: string}}, b: {kind: string; name?: null | {value: string}}) => {
      if (!a.name) return -1;
      if (!b.name) return 1;
      if (a.name.value.toLowerCase() > b.name.value.toLowerCase()) return 1;
      if (a.name.value.toLowerCase() < b.name.value.toLowerCase()) return -1;
      return 0;
    });
  await mkdir(join(schemaDirectory, `__generated__`), {recursive: true});
  await writeTypeScript(
    join(schemaDirectory, `__generated__`, `schema.ts`),
    [
      `/* eslint:disable */`,
      `// This file was automatically generated and should not be edited.`,
      ``,
      `export default \``,
      source.replace(/`/g, '\\`'),
      `\``,
      ``,
    ].join(`\n`),
  );
  const schemaContext: SchemaContext = {
    enumNames: new Set(definitions.filter(kind('EnumTypeDefinition')).map((d) => d.name.value)),
    inputObjectNames: new Set(definitions.filter(kind('InputObjectTypeDefinition')).map((d) => d.name.value)),
    objectTypeNames: new Set(definitions.filter(kind('ObjectTypeDefinition')).map((d) => d.name.value)),
    unionTypeNames: new Set(definitions.filter(kind('UnionTypeDefinition')).map((d) => d.name.value)),
    interfaceTypeNames: new Set(definitions.filter(kind('InterfaceTypeDefinition')).map((d) => d.name.value)),
  };
  await writeTypeScript(
    join(schemaDirectory, `__generated__`, `types.ts`),
    [
      `/* eslint:disable */`,
      `// This file was automatically generated and should not be edited.`,
      ``,
      dependency(`ScalarTypes`, `scalar-types`),
      dependency(`{GraphQLResolveInfo, GraphQLScalarType}`, `graphql`),
      ``,
      dependency(`ResolverContext`, `../ResolverContext`),
      dependency(
        `{\n${definitions
          .filter(kind('ObjectTypeDefinition'))
          .filter((d) => ![`Query`, `Mutation`, `Subscription`].includes(d.name.value))
          .map((d) => `  ${d.name.value},`)
          .join(`\n`)}\n}`,
        `../resolvers/types`,
      ),
      ``,
      `export type MaybePromise<T> = Promise<T> | T`,
      `export interface SubscriptionResolverObject<TArgs, TEvent> {`,
      `  resolve: (v: TEvent) => TEvent`,
      `  subscribe: (parent: {}, args: TArgs, ctx: ResolverContext) => AsyncGenerator<TEvent, any, any>`,
      `}`,
      ``,
      `// Scalar Types`,
      ``,
      ...definitions
        .filter(kind('ScalarTypeDefinition'))
        .map((d) => `export type ${d.name.value} = ScalarTypes[${JSON.stringify(d.name.value)}]`),
      ``,
      `export interface GraphQlScalarResolvers {`,
      ...definitions.filter(kind('ScalarTypeDefinition')).map((d) => `  ${d.name.value}: GraphQLScalarType`),
      `}`,
      ``,
      `// Enums`,
      ``,
      definitions
        .filter(kind('EnumTypeDefinition'))
        .map((d) =>
          [
            `export enum GraphQl${d.name.value} {`,
            ...(d.values ?? []).map(
              (v) =>
                `  ${v.name.value.toLowerCase().replace(/(?:_|^)([a-z])/g, (_, c) => c.toUpperCase())} = "${
                  v.name.value
                }",`,
            ),
            `}`,
          ].join(`\n`),
        )
        .join(`\n\n`),
      ``,
      `// Input Objects`,
      ``,
      definitions
        .filter(kind('InputObjectTypeDefinition'))
        .map((d) =>
          [
            `export interface GraphQl${d.name.value} {`,
            ...(d.fields ?? []).map((f) => `  ${inputValueDefinition(f, schemaContext)}`),
            `}`,
          ].join(`\n`),
        )
        .join(`\n\n`),
      ``,
      `// Unions`,
      ``,
      definitions
        .filter(kind('UnionTypeDefinition'))
        .map((d) =>
          [
            `export type ${d.name.value} =`,
            ...(d.types ?? []).map((t) => `  | (${t.name.value} & {__typename: ${JSON.stringify(t.name.value)}})`),
          ].join(`\n`),
        )
        .join(`\n\n`),
      ``,
      `export const UnionTypeResolvers = {`,
      ...definitions
        .filter(kind('UnionTypeDefinition'))
        .map((d) =>
          [
            `  ${d.name.value}: {`,
            `    __resolveType(obj: { __typename: string }) {`,
            `      return obj.__typename`,
            `    },`,
            `  },`,
          ].join(`\n`),
        ),
      `}`,
      ``,
      `// Interfaces`,
      ``,
      definitions
        .filter(kind('InterfaceTypeDefinition'))
        .map((d) =>
          [
            `export type ${d.name.value} =`,
            ...definitions
              .filter(kind('ObjectTypeDefinition'))
              .filter((td) => td.interfaces?.some((i) => i.name.value === d.name.value))
              .map((td) => `  | (${td.name.value} & {__typename: ${JSON.stringify(td.name.value)}})`),
          ].join(`\n`),
        )
        .join(`\n\n`),
      ``,
      `export const InterfaceTypeResolvers = {`,
      ...definitions
        .filter(kind('InterfaceTypeDefinition'))
        .map((d) =>
          [
            `  ${d.name.value}: {`,
            `    __resolveType(obj: { __typename: string }) {`,
            `      return obj.__typename`,
            `    },`,
            `  },`,
          ].join(`\n`),
        ),
      `}`,
      ``,
      `// Resolvers`,
      ``,
      definitions
        .filter(kind('ObjectTypeDefinition'))
        .map((d) =>
          d.name.value === `Subscription`
            ? [
                `export interface GraphQl${d.name.value}Resolvers {`,
                ...(d.fields ?? []).map(
                  (f) =>
                    `  ${f.name.value}: SubscriptionResolverObject<{${(f.arguments ?? [])
                      .map((a) => inputValueDefinition(a, schemaContext))
                      .join(`, `)}}, ${outputType(f.type, schemaContext)}>`,
                ),
                `}`,
              ].join(`\n`)
            : [
                `export interface GraphQl${d.name.value}Resolvers {`,
                ...(d.fields ?? []).map(
                  (f) =>
                    `  ${f.name.value}: (parent: ${
                      d.name.value === `Query` || d.name.value === `Mutation` ? `{}` : d.name.value
                    }, args: {${(f.arguments ?? [])
                      .map((a) => inputValueDefinition(a, schemaContext))
                      .join(`, `)}}, context: ResolverContext, info: GraphQLResolveInfo) => MaybePromise<${outputType(
                      f.type,
                      schemaContext,
                    )}>`,
                ),
                `}`,
              ].join(`\n`),
        )
        .join(`\n\n`),
      ``,
      `export interface GraphQlResolvers {`,
      ...definitions
        .filter(kind('ObjectTypeDefinition'))
        .map((d) => `  ${d.name.value}: GraphQl${d.name.value}Resolvers`),
      `}`,
      ``,
    ].join(`\n`),
  );

  if (generateResolvers) {
    for (const objectType of definitions.filter(kind('ObjectTypeDefinition'))) {
      const name = objectType.name.value;
      if (
        !(await stat(join(schemaDirectory, `resolvers`, name, `index.ts`)).then(
          (s) => s.isFile(),
          () => false,
        ))
      ) {
        await mkdir(join(schemaDirectory, `resolvers`, name), {recursive: true});
        await writeTypeScript(
          join(schemaDirectory, `resolvers`, name, `index.ts`),
          [
            dependency(`{GraphQl${name}Resolvers}`, `../../__generated__/types`),
            ``,
            `const ${name}: GraphQl${name}Resolvers = {`,
            ...(objectType.fields ?? []).map((f) => `  ${f.name.value}: v => v.${f.name.value},`),
            `}`,
            ``,
            `export default ${name}`,
            ``,
          ].join(`\n`),
        );
        console.warn(
          `🚨 Auto generated resolvers for ${relative(
            process.cwd(),
            join(schemaDirectory, `resolvers`, name, `index.ts`),
          )}`,
        );
        console.warn(`  These may need editing to fix any type errors`);
      }
    }

    await writeTypeScript(
      join(schemaDirectory, `resolvers`, `index.ts`),
      [
        `// This file is auto-generated, do not edit by hand!`,
        ``,
        dependency(`{ GraphQlResolvers }`, `../__generated__/types`),
        ...definitions.filter(kind('ObjectTypeDefinition')).map((d) => dependency(d.name.value, `./${d.name.value}`)),
        ``,
        `const Resolvers: GraphQlResolvers = {`,
        ...definitions.filter(kind('ObjectTypeDefinition')).map((d) => `  ${d.name.value},`),
        `}`,
        ``,
        `export default Resolvers`,
        ``,
      ].join(`\n`),
    );
  }
}

const BUILTIN_TYPES = new Map([
  [`String`, `string`],
  [`ID`, `string`],
  [`Int`, `number`],
  [`Float`, `number`],
  [`Boolean`, `boolean`],
]);

function inputValueDefinition(f: InputValueDefinitionNode, schemaContext: SchemaContext): string {
  return `${f.name.value}${f.type.kind === `NonNullType` ? `:` : `?:`} ${inputType(f.type, schemaContext)}`;
}

function inputType(t: TypeNode, schemaContext: SchemaContext): string {
  if (t.kind === 'NonNullType') {
    return nonNullInputType(t, schemaContext);
  } else {
    return `${nonNullInputType(t, schemaContext)} | null | undefined`;
  }
}

function nonNullInputType(t: TypeNode, schemaContext: SchemaContext): string {
  if (t.kind === 'NonNullType') {
    return nonNullInputType(t.type, schemaContext);
  }
  if (t.kind === `ListType`) {
    return `(${inputType(t.type, schemaContext)})[]`;
  }
  const builtin = BUILTIN_TYPES.get(t.name.value);
  if (builtin) return builtin;
  if (schemaContext.enumNames.has(t.name.value) || schemaContext.inputObjectNames.has(t.name.value))
    return `GraphQl${t.name.value}`;
  return t.name.value;
}

function outputType(t: TypeNode, schemaContext: SchemaContext): string {
  if (t.kind === 'NonNullType') {
    return nonNullOutputType(t, schemaContext);
  } else {
    return `${nonNullOutputType(t, schemaContext)} | null`;
  }
}
function nonNullOutputType(t: TypeNode, schemaContext: SchemaContext): string {
  if (t.kind === 'NonNullType') {
    return nonNullOutputType(t.type, schemaContext);
  }
  if (t.kind === `ListType`) {
    return `(${outputType(t.type, schemaContext)})[]`;
  }
  const builtin = BUILTIN_TYPES.get(t.name.value);
  if (builtin) return builtin;
  if (schemaContext.enumNames.has(t.name.value) || schemaContext.inputObjectNames.has(t.name.value))
    return `GraphQl${t.name.value}`;
  return t.name.value;
}

function kind<TKind extends string>(kind: TKind) {
  return <TValue extends {readonly kind: string}>(value: TValue): value is Extract<TValue, {readonly kind: TKind}> =>
    value.kind === kind;
}

export default async function graphqlServerTypes(args: string[]) {
  const {schemaFileNameParam, watch = false} = parse(
    startChain()
      .addParam(param.string([`-s`, `--schema`], `schemaFileNameParam`))
      .addParam(param.flag([`-w`, `--watch`], `watch`)),
    args,
  ).extract();
  if (!schemaFileNameParam) {
    console.error(`Missing value for --schema`);
    process.exit(1);
  }

  const schemaFileNameAbsolute = resolve(schemaFileNameParam);
  const schemaFileName = relative(process.cwd(), schemaFileNameAbsolute);
  const schemaDirectory = dirname(schemaFileNameAbsolute);

  if (watch) {
    let running = false;
    let dirty = false;
    const onUpdate = () => {
      if (running) {
        dirty = true;
      } else {
        running = true;
        dirty = false;
        void run(schemaFileName, schemaDirectory, true)
          .catch((ex) => {
            console.error(``);
            console.error(``);
            if (isGraphQlValidationError(ex)) {
              console.error(`🚨 ${ex.message}`);
            } else {
              console.error(`🚨 ${ex.stack || ex.message}`);
            }
            console.error(``);
            console.error(``);
          })
          .then(() => {
            running = false;
            if (dirty) {
              onUpdate();
            }
          });
      }
    };
    onUpdate();

    watchFile(schemaFileName, {persistent: true}, onUpdate);
    await new Promise<void>((resolve) => {
      process.once(`SIGINT`, () => resolve());
    });
  } else {
    try {
      await run(schemaFileName, schemaDirectory, true);
    } catch (ex: any) {
      console.error(``);
      if (isGraphQlValidationError(ex)) {
        console.error(`🚨 ${ex.message}`);
      } else {
        console.error(`🚨 ${ex.stack || ex.message}`);
      }
      process.exit(1);
    }
  }
}

graphqlServerTypes(process.argv.slice(2)).catch((ex) => {
  console.error(ex.stack || ex);
  process.exit(1);
});
