import { useApolloClient } from '@apollo/react-hooks';
import { ApolloError, FetchResult } from 'apollo-boost';
import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { LOGIN, UPDATE_USER_DATA, UPDATE_USER_PASSWORD } from '../graphql/mutations';

export type IUpdateUserMethod = (variables: {
  email: string,
  first_name: string,
  last_name: string,
  language: string,
  avatar?: string,
}) => Promise<{ data: any, errors: any }>;

export type IUpdatePasswordMethod = (variables: {
  currentPassword: string,
  newPassword: string,
}) => Promise<{ data: any, errors: any }>;

export interface IAuthUserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  language: string;
}

export interface IAuthContext {
  token: string | null;
  error: ApolloError | null;
  user: IAuthUserData;
  signin: (email: string, password: string) => ISigninOutput;
  signout: () => void;
  updateUser: IUpdateUserMethod;
  updatePassword: IUpdatePasswordMethod;
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

  const setTokenData = (tokenValue: string | null) => {
    if (tokenValue) {
      localStorage.setItem('token', tokenValue);
    } else {
      localStorage.removeItem('token');
    }

    setToken(tokenValue);
  };

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

        if (data.login && data.login.token) {
          const loginToken = data.login.token;

          setTokenData(loginToken);
          setError(null);
        }

        return { data, errors };
      });
  };

  const signout = () => {
    client.resetStore();
    setTokenData(null);
    setError(null);
  };

  const updateUser: IUpdateUserMethod = (variables) => {
    return client.mutate({
      mutation: UPDATE_USER_DATA,
      variables,
    }).then((response) => {
      const { data, errors } = response;

      if (data.updateUserData && data.updateUserData.token) {
        setTokenData(data.updateUserData.token);
      }

      return { data, errors };
    }).catch((e) => {
      const firstError = e.networkError
        && e.networkError.result
        && e.networkError.result.errors
        && e.networkError.result.errors[0];

      if (firstError) {
        throw new Error(firstError.message);
      }

      throw e;
    });
  };

  const updatePassword: IUpdatePasswordMethod = (variables) => {
    return client.mutate({
      mutation: UPDATE_USER_PASSWORD,
      variables,
    }).then((response) => {
      const { data, errors } = response;

      if (data.updateUserPassword) {
        setError(null);
      }

      return { data, errors };
    });
  };

  // @TODO: Do these
  // const signup = (email, password) => {
  // };

  // const sendPasswordResetEmail = (email) => {
  // };

  // const confirmPasswordReset = (code, password) => {
  // };

  useLayoutEffect(() => {
    if (token) {
      try {
        const decodedUserData = jwtDecode(token);
        setUser(decodedUserData);
        setError(null);
      } catch (e) {
        setError(e);
      }
    }

    if (!token) {
      setUser(null);
    }
  }, [token]);

  return {
    error,
    token,
    user,

    signin,
    signout,
    // signup,

    updatePassword,
    updateUser,

    // confirmPasswordReset,
    // sendPasswordResetEmail,
  };
}
