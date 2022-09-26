import {deepStrictEqual} from 'assert';

import ScalarTypes from 'scalar-types';
import * as ft from 'funtypes';
import {GraphQLScalarType, ValueNode} from 'graphql';

function getLiteralValue(literal: ValueNode, variables: {[key: string]: any} | null): unknown {
  switch (literal.kind) {
    case 'IntValue':
      return parseInt(literal.value, 10);
    case 'FloatValue':
      return parseFloat(literal.value);
    case 'StringValue':
      return literal.value;
    case 'BooleanValue':
      return literal.value;
    case 'NullValue':
      return null;
    case 'EnumValue':
      return literal.value;
    case 'ListValue':
      return literal.values.map((v) => getLiteralValue(v, variables));
    case 'ObjectValue':
      return Object.fromEntries(literal.fields.map((f) => [f.name.value, getLiteralValue(f.value, variables)]));
    case 'Variable':
      if (!variables) return null;
      return variables[literal.name.value];
  }
}

export default function createScalars(
  scalars: {
    [key in keyof ScalarTypes]:
      | ((value: unknown) => ScalarTypes[key])
      | {
          safeParse: (x: any) => ft.Result<ScalarTypes[key]>;
          safeSerialize: (x: ScalarTypes[key]) => ft.Result<unknown>;
        }
      | GraphQLScalarType;
  },
  descriptions: {
    [key in keyof ScalarTypes]?: string;
  },
): {
  [key in keyof ScalarTypes]: GraphQLScalarType;
} {
  const output = Object.fromEntries(
    Object.entries(scalars).map(([name, scalar]) => {
      if (scalar instanceof GraphQLScalarType) {
        return [name, scalar];
      } else {
        const serialize =
          typeof scalar === 'function'
            ? scalar
            : (value: unknown) => {
                const result = scalar.safeSerialize(
                  // @ts-expect-error
                  value,
                );
                if (result.success) {
                  try {
                    deepStrictEqual(JSON.parse(JSON.stringify(value)), JSON.parse(JSON.stringify(result.value)));
                  } catch (ex: any) {
                    throw Object.assign(new TypeError(`Invalid value for ${name}, ${ex.message}`), {
                      code: `INVALID_SCALAR_OUTPUT`,
                    });
                  }
                  return result.value;
                } else {
                  throw Object.assign(new TypeError(ft.showError(result)), {
                    code: `INVALID_SCALAR_OUTPUT`,
                  });
                }
              };
        const parse =
          typeof scalar === 'function'
            ? scalar
            : (value: unknown) => {
                const result = scalar.safeParse(value);
                if (result.success) {
                  try {
                    deepStrictEqual(JSON.parse(JSON.stringify(value)), JSON.parse(JSON.stringify(result.value)));
                  } catch (ex: any) {
                    throw Object.assign(new TypeError(`Invalid value for ${name}, ${ex.message}`), {
                      code: `INVALID_SCALAR_INPUT`,
                    });
                  }
                  return result.value;
                } else {
                  throw Object.assign(new TypeError(ft.showError(result)), {
                    code: `INVALID_SCALAR_INPUT`,
                  });
                }
              };
        return [
          name,
          new GraphQLScalarType({
            name,
            description: descriptions[name as keyof typeof descriptions],
            serialize(value) {
              return serialize(value);
            },
            parseValue(value) {
              return parse(value);
            },
            parseLiteral(literal, variables) {
              const value = getLiteralValue(literal, variables ?? null);
              return parse(value);
            },
          }),
        ];
      }
    }),
  );
  // @ts-expect-error - Record<string, GraphQLScalarType> doesn't necessarily have a prop for every key
  return output;
}
