import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

// https://github.com/facebook/react/issues/14110#issuecomment-446845886
const Context = createContext({});

const { Provider } = Context;

// Helpers to get and set using the dot notation selector
const dotGet = (obj: any, sel: any) => {
  if (typeof sel === 'function') { return sel(obj); }
  return sel.split('.').reduce((newObj: any, i: any) => newObj[i], obj);
};
const dotSet = (obj: any, sel: any, value: any): any => {
  const [key, ...rest] = sel.split('.');
  const subSel = rest.join('.');
  const subValue = subSel ? dotSet(obj[key], subSel, value) : value;
  if (Array.isArray(obj)) {
    const data = obj.map((item, i) => (i === parseInt(key, 10) ? subValue : item));
    return data;
  }
  return { ...obj, [key]: subValue };
};

// Deep freeze any object
const freeze = (obj: { [x: string]: any; }) => {
  // Does not need freezing
  if (typeof obj !== 'object') { return obj; }

  // Already frozen
  if (Object.isFrozen(obj)) { return obj; }

  // Freeze props before freezing self
  for (const key of Object.getOwnPropertyNames(obj)) {
    if (Array.isArray(obj) && key === 'length') { continue; }
    obj[key] = typeof obj[key] === 'object' ? freeze(obj[key]) : obj[key];
  }
  return Object.freeze(obj);
};

const exclude = (obj: { [x: string]: any; }, keys: any[]) => {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (!keys.includes(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

// Helper - parse the multi-type passed value and put that into the update fn
const resolve = (state: { [x: string]: any; }, setState: any): any => (value: any): any => {
  while (typeof value === 'function') {
    value = value(freeze(state));
  }
  return value && value.then ? value.then(setState) : setState(value);
};

// Create a swallow clone of the array so that it can be mutated in place
const applyMutation = (state: any[], setState: (arg0: any) => void) => (mutation: any) => {
  return (...args: any) => {
    const cloned = state.slice();
    mutation(cloned, ...args);
    setState(cloned);
  };
};

const createActions = (state: any, setState: any) => {
  // Generic one `setUser('Francisco')`
  const setter = resolve(state, setState);

  if (Array.isArray(state)) {
    const mutate = applyMutation(state, setState); // <- INTERNAL USE ONLY

    // Mutation methods
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Mutator_methods
    setter.fill = mutate((items: any, ...args: any) => items.fill(...args));
    setter.pop = mutate((items: any, ...args: any) => items.pop(...args));
    setter.push = mutate((items: any, ...args: any) => items.push(...args));
    setter.reverse = mutate((items: any, ...args: any) => items.reverse(...args));
    setter.shift = mutate((items: any, ...args: any) => items.shift(...args));
    setter.sort = mutate((items: any, ...args: any) => items.sort(...args));
    setter.splice = mutate((items: any, ...args: any) => items.splice(...args));
    setter.unshift = mutate((items: any, ...args: any) => items.unshift(...args));

    // Change the array in some immutable way. Helpers to make it easier
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Accessor_methods
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Iteration_methods
    setter.concat = (...args: any) => setter(state.concat(...args));
    setter.slice = (...args: any) => setter(state.slice(...args));
    setter.filter = (...args: any) => setter((state.filter as any)(...args));
    setter.map = (...args: any) => setter((state.map as any)(...args));
    setter.reduce = (...args: any) => setter((state.reduce as any)(...args));
    setter.reduceRight = (...args: any) => setter((state.reduceRight as any)(...args));

    // Aliases
    setter.append = setter.push;
    setter.prepend = setter.unshift;
    setter.remove = (index: number) => setter.splice(Number(index), 1);
  } else if (typeof state === 'object') {
    setter.assign = (...args: any) => setter(Object.assign({}, state, ...args));
    setter.remove = (...args: any) => setter(exclude(state, args));

    // Aliases
    setter.extend = setter.assign;
  }

  // Numbers
  setter.add = resolve(state, (num: number) => setState(state + num));

  return setter;
};

// Rerender whatever is listening when there's a change in the state fragment
// derived from the selector, which might happen because of a state change or
// because of a selector change
const useSubscription = (sel = (s: any) => s) => {
  const { state, subscribe } = useContext<{ state: Record<string, any>, subscribe: any }>((Context as any));
  // const init = dotGet(state.current, sel);
  const update = useState({}).pop();

  const selRef = useRef(sel);
  const subRef = useRef(null);

  // New selector, reset it, unsubscribe from the old one and leave it empty
  // for the next subscription
  if (selRef.current !== sel) {
    selRef.current = sel;
    if (subRef && subRef.current) {
      // @ts-ignore
      subRef.current();
    }
    subRef.current = null;
  }

  if (!subRef.current) {
    subRef.current = subscribe((old: Record<string, any>) => {
      const oldFragment = dotGet(old, selRef.current);
      const newFragment = dotGet(state.current, selRef.current);
      if (oldFragment === newFragment) { return; }
      // @ts-ignore
      update({});
    });
  }
};

export const useSelector = (sel = (s: any) => s) => {
  useSubscription(sel);
  const { state } = useContext<{ state: Record<string, any> }>((Context as any));
  return freeze(dotGet(state.current, sel));
};

export const useActions = (sel: ((s: any) => any) | undefined) => {
  useSubscription(sel);
  const { state, setState } = useContext<{ state: Record<string, any>, setState: any }>((Context as any));
  let callback;
  let dependencies;
  if (sel) {
    const subState = dotGet(state.current, sel);
    const subSetter = (value: any) => setState(dotSet(state.current, sel, value), { type: sel, payload: value });
    callback = createActions(subState, subSetter);
    dependencies = [subState];
  } else {
    callback = createActions(state.current, (value: any) => setState(value, { type: sel, payload: value }));
    dependencies = [state.current];
  }
  return useCallback(callback, dependencies);
};

// Unlike the class component setState, the updates are not allowed to be partial
type SetStateAction<S> = S | ((prevState: S) => S);
// this technically does accept a second argument, but it's already under a deprecation warning
// and it's not even released so probably better to not define it.
type Dispatch<A> = (value: A) => void;

export function useStore<S>(
  name?: string | ((data: Record<string, any>) => S),
): [S, Dispatch<SetStateAction<S>>] {
  return [useSelector(name as any) as any, useActions(name as any)];
}

export const StoreContext = Context;

export default ({ children, ...initial }: any) => {
  const state = useRef(initial);
  const subs: Array<() => void> = [];
  const subscribe: (fn: () => void) => {} = (fn) => {
    subs.push(fn);
    // Unsubscribe in the callback
    return () => subs.splice(subs.findIndex((item) => item === fn), 1);
  };
  const setState = (newState: any, type: any) => {
    const old = state.current;
    state.current = newState;
    subs.forEach((sub) => (sub as any)(old, newState, type));
  };
  return <Provider value={{ state, setState, subscribe }}>{children}</Provider>;
};
