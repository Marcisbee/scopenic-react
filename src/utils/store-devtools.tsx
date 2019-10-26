import React, { useCallback, useContext, useLayoutEffect, useState } from 'react';

import { StoreContext } from './store';

declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

const defaultOptions = {
  features: {
    pause: true, // start/pause recording of dispatched actions
    lock: true, // lock/unlock dispatching actions and side effects
    export: true, // export history of actions in a file
    import: 'custom', // import history of actions from a file
    jump: true, // jump back and forth (time travelling)

    skip: false, // Cannot skip for we cannot replay.
    reorder: false, // Cannot skip for we cannot replay.
    persist: false, // Avoid trying persistence.
    dispatch: false,
    test: false,
  },
};

const PropInspector: React.FC<{ initial: Record<string, any> }> = React.memo(({ children, ...initial }) => {
  const [connection, setConnection] = useState<any>(null);
  const { setState, subscribe } = useContext<any>(StoreContext);
  const dispatch = useCallback(({ type, state, payload }) => {
    if (type === 'DISPATCH' && (
      payload.type === 'JUMP_TO_STATE' || payload.type === 'JUMP_TO_ACTION'
    )) {
      setState(JSON.parse(state), payload);
    }
  }, []);

  useLayoutEffect(() => {
    const devtoolsConnection = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
      name,
      defaultOptions,
    });

    devtoolsConnection.init(initial);
    devtoolsConnection.subscribe(dispatch);

    setConnection(devtoolsConnection);

    const subscription = subscribe((oldState: any, newState: any, action: any = {}) => {
      const { type, payload } = action || {};
      if (type === 'JUMP_TO_STATE' || type === 'JUMP_TO_ACTION') {
        return;
      }

      devtoolsConnection.send({
        type: `[UPDATE] ${type || 'ROOT'}`,
        payload,
      }, newState);
    });

    return () => {
      window.__REDUX_DEVTOOLS_EXTENSION__.disconnect(connection);
      subscription();
    };
  }, []);

  return <>{children}</>;
}, () => false);

const StatuxDevtools = (Context: any) => ({ children, ...initial }: any) => {
  const hasReduxDevtools = typeof window !== 'undefined' && !!window.__REDUX_DEVTOOLS_EXTENSION__;

  if (!hasReduxDevtools) {
    // tslint:disable-next-line: no-console
    console.error('You must have Redux DevTools Extension installed in order to inspect store. Install it at http://extension.remotedev.io/');
    return <Context {...initial}>{children}</Context>;
  }

  return (
    <Context {...initial}>
      <PropInspector {...initial}>
        {children}
      </PropInspector>
    </Context>
  );
};

export default StatuxDevtools;
