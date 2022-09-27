import {GraphOperation} from './operations';

type Result<TResult> = {ok: true; data: TResult} | {ok: false; data: unknown; errors: unknown[]};

type ExecuteFn<TVariables, TResult> = TVariables extends {}
  ? (variables?: TVariables) => Promise<Result<TResult>>
  : (variables: TVariables) => Promise<Result<TResult>>;

export default function request<TVariables, TResult>(
  operation: GraphOperation<TVariables, TResult>,
): {execute: ExecuteFn<TVariables, TResult>} {
  const execute = async (variables?: TVariables): Promise<Result<TResult>> => {
    const result = await fetch(`http://localhost:8000/graphql`, {
      method: `POST`,
      headers: {'Content-Type': `application/json`},
      body: JSON.stringify({
        query: operation,
        variables,
      }),
    });
    if (!result.ok) {
      throw new Error(`API failed: ${await result.text()}`);
    }
    const resultData = await result.json();
    if (resultData.errors?.length) {
      return {ok: false, data: resultData.data, errors: resultData.errors};
    } else {
      return {ok: true, data: resultData.data};
    }
  };
  // @ts-expect-error
  return {execute};
}
