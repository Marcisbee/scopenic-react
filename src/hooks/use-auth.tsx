import { useApolloClient } from '@apollo/react-hooks';
import { ApolloError, FetchResult } from 'apollo-boost';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { LOGIN } from '../graphql/mutations';
import { GET_CURRENT_USER } from '../graphql/queries';

export interface IAuthUserData {
  id: string;
  email: string;
}

export interface IAuthContext {
  token: string | null;
  error: ApolloError | null;
  user: IAuthUserData;
  signin: (email: string, password: string) => any;
  signout: () => void;
}

const authContext = createContext<IAuthContext>({} as any);

export const ProvideAuth: React.FC = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

export const useLoggedInGuard = () => {
  const location = useLocation();
  const { token } = useAuth();
  let redirect = null;

  if (token) {
    const defaultRoute = '/projects';

    if (location.state && location.state.from) {
      const from = (location.state && location.state.from) || {};
      const path = (from.pathname && from.pathname !== location.pathname)
        ? `${from.pathname}${from.search}`
        : defaultRoute;

      redirect = path;
    } else {
      redirect = defaultRoute;
    }
  }

  return redirect;
};

type ISigninOutput = Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;

function useProvideAuth() {
  const initialToken = localStorage.getItem('token');
  const client = useApolloClient();
  const [token, setToken] = useState(initialToken);
  const [error, setError] = useState(null);
  const [user, setUser] = useState();

  const signin = (email: string, password: string): ISigninOutput => {
    return client.mutate({
        mutation: LOGIN,
        variables: {
          email,
          password,
        },
      })
      .then((response) => {
        const { data, errors } = response;

        if (data.login && data.login.id) {
          const loginToken = data.login.id;

          localStorage.setItem('token', loginToken);
          setToken(loginToken);
          setError(null);
        }

        return { data, errors };
      });
  };

  const signout = () => {
    localStorage.removeItem('token');
    client.resetStore();
    setToken(null);
    setError(null);
  };

  // @TODO: Do these
  // const signup = (email, password) => {
  // };

  // const sendPasswordResetEmail = (email) => {
  // };

  // const confirmPasswordReset = (code, password) => {
  // };

  useEffect(() => {
    if (!token) {
      setUser(undefined);
      setError(null);
      return;
    }

    client.query({
      fetchPolicy: 'network-only',
      query: GET_CURRENT_USER,
    })
    .then(({ data, errors }) => {
      if (errors) {
        throw errors;
      }

      if (!data || !data.currentUser) {
        throw new Error('no-user');
      }

      setUser(data.currentUser);
      setError(null);
    })
    .catch((e) => {
      setError(e);
    });
  }, [token]);

  return {
    error,
    token,
    user,

    signin,
    signout,
    // signup,

    // confirmPasswordReset,
    // sendPasswordResetEmail,
  };
}
