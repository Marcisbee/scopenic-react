import React, { createContext, useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useApolloClient } from '@apollo/react-hooks';

export interface IAuthUserData {
  id: string;
  email: string;
}

export interface IAuthContext {
  authToken?: string | null;
  userData: IAuthUserData;
  setAuthToken: (value: string) => void;
  setUserData: (value: string) => void;
  removeAuthToken: () => void;
  logout?: () => void;
}

const AuthContext = createContext<IAuthContext>({
  setAuthToken: () => {},
  userData: {} as IAuthUserData,
  setUserData: () => {},
  removeAuthToken: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const client = useApolloClient();
  const token = localStorage.getItem('token');
  const history = useHistory();
  const [authToken, setAuthToken] = useState<string | null>(token);
  const [userData, setUserData] = useState<IAuthUserData>(null as unknown as IAuthUserData);

  const setToken = (value: string) => {
    localStorage.setItem('token', value);
    setAuthToken(value);
  }

  const setUser = (data: any) => {
    setUserData(data);
  }

  const removeToken = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    history.push('/login');
  }

  const logout = () => {
    client.resetStore();
    removeToken();
  }

  return (
    <AuthContext.Provider value={{
      authToken,
      userData,
      setAuthToken: setToken,
      setUserData: setUser,
      removeAuthToken: removeToken,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useLoggedInGuard() {
  const location = useLocation();
  const { authToken } = useAuth();
  let redirect = null;

  if (authToken) {
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
}
