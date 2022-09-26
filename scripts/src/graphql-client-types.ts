import {promises as fs} from 'fs';
import {resolve, relative} from 'path';

import {codeFrameColumns} from '@babel/code-frame';
import {CompilerContext, compileToIR} from 'apollo-codegen-core/lib/compiler';
import {generateGlobalSource} from 'apollo-codegen-typescript';
import {TypescriptAPIGenerator} from 'apollo-codegen-typescript/lib/codeGeneration';
import {GraphQLSchema, parse as parseOperations, Source} from 'graphql';
import graphCompress from 'graphql-query-compress';
import {param, parse, startChain} from 'parameter-reducers';

import {writeTypeScript} from './utils/codegen';
import {GraphQlValidationErrorCode, isGraphQlValidationError, readGraphQlSchemaFile} from './utils/graphql';
import watchFile from './utils/watchFile';

const customScalars = `import ScalarTypes from "scalar-types"`;

const definitions = `

export type GraphOperation<Variables, Result> = string & {
  signature: null | ((variables: Variables) => Result)
}
export type GraphSubscriptionOperation<Variables, Result> = string & {
  subscriptionSignature: null | ((variables: Variables) => Result)
}

`;

let schemaCache: GraphQLSchema | null = null;

function formatScalarTypes(str: string) {
  return str.replace(/ScalarTypes\.([A-Za-z0-9_$]+)/g, (_, name) => `ScalarTypes["${name}"]`);
}
async function processFile(inputFile: string, schema: GraphQLSchema) {
  inputFile = resolve(inputFile);
  const source = await fs.readFile(inputFile, 'utf8');
  let document;
  try {
    document = parseOperations(new Source(source, inputFile));
  } catch (ex: any) {
    ex.message = formatGraphQlError(ex, source, relative(process.cwd(), inputFile));
    ex.code = GraphQlValidationErrorCode.GRAPHQL_SYNTAX_ERROR;
    throw ex;
  }
  let context: CompilerContext | undefined;
  try {
    context = compileToIR(schema, document, {
      customScalarsPrefix: 'ScalarTypes.',
      passthroughCustomScalars: true,
    });
  } catch (ex: any) {
    ex.message = formatGraphQlError(ex, source, relative(process.cwd(), inputFile));
    ex.code = GraphQlValidationErrorCode.GRAPHQL_QUERY_ERROR;
    throw ex;
  }
  const sharedTypes = generateGlobalSource(context).fileContents;
  const generator = new TypescriptAPIGenerator(context);

  function getFragmentNames(set: any): string[] {
    return set.selections
      .map((s: any) => {
        switch (s.kind) {
          case 'Field':
            return s.selectionSet ? getFragmentNames(s.selectionSet) : [];
          case 'BooleanCondition':
            return getFragmentNames(s.selectionSet);
          case 'FragmentSpread':
            return [s.fragmentName, ...getFragmentNames(s.selectionSet)];
          case 'TypeCondition':
            return getFragmentNames(s.selectionSet);
          default:
            throw new Error(`Unknown selection kind ${s.kind}`);
        }
      })
      .reduce((a: any, b: any) => [...a, ...b], []);
  }
  Object.values(context.operations).forEach((operation) => {
    generator.interfacesForOperation(operation);

    const fragments = [...new Set(getFragmentNames(operation.selectionSet))];

    const operationType = operation.operationType === `subscription` ? `GraphSubscriptionOperation` : `GraphOperation`;
    generator.printer.enqueue(
      `export const ${operation.operationName}: ${operationType}<${
        operation.variables.length ? `${operation.operationName}Variables` : `{}`
      }, ${operation.operationName}> = \`${graphCompress(
        `${operation.source}${fragments
          .map((fragmentName: string) => `\n${context!.fragments[fragmentName].source}`)
          .join(`\n`)}`,
      )}\` as any;`,
    );
  });

  Object.values(context.fragments).forEach((fragment) => {
    generator.interfacesForFragment(fragment);
  });
  const [header, ...rest] = sharedTypes.split('\n\n');
  const body = definitions + rest.join('\n\n') + `\n\n` + generator.printer.printAndClear();
  await writeTypeScript(
    `${inputFile.replace(/\.graphql$/, '')}.ts`,
    formatScalarTypes(
      header.includes(`ScalarTypes`) || body.includes(`ScalarTypes`)
        ? header + `\n${customScalars}` + body
        : header + body,
    ),
  );
}

async function run(schemaFileName: string, operationsFilename: string) {
  if (schemaCache) {
    await processFile(operationsFilename, schemaCache);
  } else {
    await readGraphQlSchemaFile(schemaFileName).then(
      async ({schema}) => {
        schemaCache = schema;
        await processFile(operationsFilename, schema);
      },
      (err) => {
        schemaCache = null;
        throw err;
      },
    );
  }
}

export function formatGraphQlError(e: any, source: string, filename: string) {
  if (e.locations && e.locations.length === 1) {
    const [loc] = e.locations;
    return `${e.message}\n\n${filename}\n\n${codeFrameColumns(source, {
      start: {
        line: loc.line,
        column: loc.column,
      },
    })}\n`;
  } else {
    throw e;
  }
}

export default async function graphqlClientTypes(args: string[]) {
  const {
    operationsFilename,
    schemaFileNameParam,
    watch = false,
  } = parse(
    startChain()
      .addParam(param.string([`-s`, `--schema`], `schemaFileNameParam`))
      .addParam(param.flag([`-w`, `--watch`], `watch`))
      .addParam(param.positionalString('operationsFilename')),
    args,
  ).extract();
  if (!operationsFilename || !schemaFileNameParam) {
    throw new Error('Usage: graphql-client-types <OPERATIONS_FILE_NAME> --schema <SCHEMA_FILE_NAME>');
  }

  const schemaFileName = relative(process.cwd(), resolve(schemaFileNameParam));

  if (watch) {
    let running = false;
    let dirty = false;
    const onUpdate = () => {
      if (running) {
        dirty = true;
      } else {
        running = true;
        dirty = false;
        void run(schemaFileName, operationsFilename)
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
    watchFile(resolve(operationsFilename), {persistent: true}, () => {
      onUpdate();
    });
    watchFile(schemaFileName, {persistent: true}, () => {
      schemaCache = null;
      onUpdate();
    });
    await new Promise<void>((resolve) => {
      process.once(`SIGINT`, () => resolve());
    });
  } else {
    try {
      await run(schemaFileName, operationsFilename);
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

graphqlClientTypes(process.argv.slice(2)).catch((ex) => {
  console.error(ex.stack || ex);
  process.exit(1);
});
