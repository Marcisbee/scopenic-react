import React, { createContext, useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router';

export interface IAuthContext {
  authToken: string | null;
  setAuthToken: (value: string) => void;
  userData: Record<string, any> | null;
  setUserData: (value: string) => void;
  removeAuthToken: () => void;
}

const AuthContext = createContext<IAuthContext>({
  authToken: null,
  setAuthToken: () => {},
  userData: null,
  setUserData: () => {},
  removeAuthToken: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const token = localStorage.getItem('token');
  const history = useHistory();
  const [authToken, setAuthToken] = useState(token);
  const [userData, setUserData] = useState(token);

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

  return (
    <AuthContext.Provider value={{
      authToken,
      setAuthToken: setToken,
      userData: userData as Record<string, any> | null,
      setUserData: setUser,
      removeAuthToken: removeToken,
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
