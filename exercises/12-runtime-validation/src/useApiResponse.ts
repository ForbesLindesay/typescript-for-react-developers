import {useEffect, useState} from 'react';

type ApiResponseState<T> =
  | {status: 'loading'}
  | {status: 'loaded'; value: T}
  | {status: 'failed'; reason: string};

export default function useApiResponse<T>(fn: () => Promise<T>) {
  const [state, setState] = useState<ApiResponseState<T>>({status: 'loading'});
  useEffect(() => {
    setState((s) => (s.status === 'loading' ? s : {status: 'loading'}));
    let cancelled = false;
    fn().then(
      (value) => {
        if (cancelled) return;
        setState({status: 'loaded', value});
      },
      (err) => {
        if (cancelled) return;
        setState({
          status: 'failed',
          reason: `${err.message || err || `Unknown Error`}`,
        });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [fn]);
  return state;
}
