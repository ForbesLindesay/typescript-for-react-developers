import {readFile} from 'fs/promises';

import {codeFrameColumns} from '@babel/code-frame';
import {buildASTSchema, DocumentNode, parse} from 'graphql';
import {validateSDL} from 'graphql/validation/validate';

export enum GraphQlValidationErrorCode {
  GRAPHQL_FILE_MISSING = 'GRAPHQL_FILE_MISSING',
  GRAPHQL_SYNTAX_ERROR = 'GRAPHQL_SYNTAX_ERROR',
  GRAPHQL_SCHEMA_ERROR = 'GRAPHQL_SCHEMA_ERROR',
  GRAPHQL_QUERY_ERROR = 'GRAPHQL_QUERY_ERROR',
}
const GraphQlValidationErrorCodes: ReadonlySet<string> = new Set(Object.values(GraphQlValidationErrorCode));
export function isGraphQlValidationError(err: any): Error & {code: GraphQlValidationErrorCode} {
  return typeof err === 'object' && err && GraphQlValidationErrorCodes.has(err.code);
}

export async function readGraphQlSchemaFile(schemaFileName: string) {
  const schemaString = await readFile(schemaFileName, `utf8`).catch((ex) => {
    if (ex.code !== `ENOENT`) throw ex;
    return null;
  });
  if (schemaString === null) {
    throw Object.assign(new Error(`${schemaFileName} does not exist`), {
      code: `GRAPHQL_FILE_MISSING`,
    });
  }
  return parseGraphQlSchema(schemaString, schemaFileName);
}

export function parseGraphQlSchema(schemaString: string, schemaFileName: string) {
  let parsedSchema: DocumentNode;
  try {
    parsedSchema = parse(schemaString);
  } catch (ex: any) {
    throw Object.assign(new Error(formatGraphQlError(ex, schemaString, schemaFileName)), {
      code: `GRAPHQL_SYNTAX_ERROR`,
    });
  }

  const validationErrors = validateSDL(parsedSchema);
  if (validationErrors.length) {
    // TODO: show all errors
    throw Object.assign(new Error(formatGraphQlError(validationErrors[0], schemaString, schemaFileName)), {
      code: `GRAPHQL_SCHEMA_ERROR`,
    });
  }

  return {
    source: schemaString,
    documentNode: parsedSchema,
    schema: buildASTSchema(parsedSchema, {
      assumeValid: true,
      assumeValidSDL: true,
    }),
  };
}

function formatGraphQlError(e: any, source: string, filename: string) {
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
