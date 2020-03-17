import { useLayoutEffect, useReducer } from 'react';

function resolvePromise(promise: any) {
  if (typeof promise === 'function') {
    return promise();
  }

  return promise;
}

const states = {
  pending: 'pending',
  rejected: 'rejected',
  resolved: 'resolved',
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case states.pending:
      return {
        error: undefined,
        result: undefined,
        state: states.pending,
      };

    case states.resolved:
      return {
        error: undefined,
        result: action.payload,
        state: states.resolved,
      };

    case states.rejected:
      return {
        error: action.payload,
        result: undefined,
        state: states.rejected,
      };

    /* istanbul ignore next */
    default:
      return state;
  }
}

const fulfilledPromises: Record<string, any> = {};

export function usePromise<T = undefined>(
  promise: ((() => Promise<T>) | Promise<T>),
  inputs?: any,
): [T | undefined, Error | undefined, 'pending' | 'fulfilled' | 'rejected'] {
  const cached = fulfilledPromises[String(inputs)];
  const [{ error, result, state }, dispatch] = useReducer(reducer, {
    error: undefined,
    result: cached,
    state: !!cached ? states.resolved : states.pending,
  });

  useLayoutEffect(() => {
    if (state === states.resolved) {
      return;
    }

    promise = resolvePromise(promise) as Promise<T>;

    if (!promise) {
      return;
    }

    let canceled = false;

    dispatch({ type: states.pending });

    promise.then(
      (res) => {
        if (canceled) {
          return;
        }

        fulfilledPromises[String(inputs)] = res;
        dispatch({
          payload: res,
          type: states.resolved,
        });
      },
      (err) => !canceled && dispatch({
        payload: err,
        type: states.rejected,
      }),
    );

    return () => {
      canceled = true;
    };
  }, inputs);

  return [result, error, state];
}
