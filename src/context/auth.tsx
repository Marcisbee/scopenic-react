import React, { createContext, useState, useContext } from 'react';
import { ApolloClient } from 'apollo-boost';

export interface IAuthContext {
  authToken: string | null;
  authClient: ApolloClient<any> | null;
  setAuthClient: (client: ApolloClient<any>) => void;
  setAuthToken: (value: string) => void;
  removeAuthToken: () => void;
}

const AuthContext = createContext<IAuthContext>({
  authToken: null,
  authClient: null,
  setAuthClient: () => {},
  setAuthToken: () => {},
  removeAuthToken: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [authClient, setAuthClient] = useState();
  const [authToken, setAuthToken] = useState();

  const setClient = (client: ApolloClient<any>) => {
    setAuthClient(client);
  }

  const setToken = (value: string) => {
    localStorage.setItem('token', value);
    setAuthToken(value);
  }

  const removeToken = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  }

  return (
    <AuthContext.Provider value={{
      authToken,
      authClient,
      setAuthClient: setClient,
      setAuthToken: setToken,
      removeAuthToken: removeToken,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}
