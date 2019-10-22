import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [enabledState, setEnabledState] = useLocalStorage('dark-mode-enabled');
  const prefersDarkMode = usePrefersDarkMode();
  const enabled =
    typeof enabledState !== 'undefined' ? enabledState : prefersDarkMode;

  useEffect(
    () => {
      const className = 'pt-dark';
      const element = window.document.body;
      if (enabled) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    },
    [enabled],
  );

  return [enabled, setEnabledState];
};

const usePrefersDarkMode = () => {
  return useMedia(['(prefers-color-scheme: dark)'], [true], false);
};

export const useMedia = (queries: string[], values: any[], defaultValue: any) => {
  const mediaQueryLists = queries.map((q) => window.matchMedia(q));
  const getValue = () => {
    const index = mediaQueryLists.findIndex((mql) => mql.matches);

    return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
  };
  const [value, setValue] = useState(getValue);

  useEffect(
    () => {
      const handler = () => setValue(getValue);
      mediaQueryLists.forEach((mql) => mql.addListener(handler));

      return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler));
    },
    [],
  );

  return value;
};

const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);

      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
