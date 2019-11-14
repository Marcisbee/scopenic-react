import produce from 'immer';
import React from 'react';

export function createStore<T = undefined>(initialState: T) {
  const StateContext = React.createContext(initialState);
  const UpdateContext = React.createContext<any>(null as any);

  const StoreProvider: React.FC = ({ children }) => {
    const [state, updateState] = React.useReducer(produce, initialState);

    return (
      <UpdateContext.Provider value={updateState}>
        <StateContext.Provider value={state as T}>
          {children}
        </StateContext.Provider>
      </UpdateContext.Provider>
    );
  };

  function useStore(): [
    T,
    (cb: (draft: T) => void) => void,
  ] {
    return [
      React.useContext(StateContext),
      React.useContext(UpdateContext),
    ];
  }

  return { Provider: StoreProvider, useStore };
}
