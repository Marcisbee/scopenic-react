import React, { createContext, useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router';

export interface IAuthContext {
  authToken: string | null;
  setAuthToken: (value: string) => void;
  removeAuthToken: () => void;
}

const AuthContext = createContext<IAuthContext>({
  authToken: null,
  setAuthToken: () => {},
  removeAuthToken: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const token = localStorage.getItem('token');
  const history = useHistory();
  const [authToken, setAuthToken] = useState(token);

  const setToken = (value: string) => {
    localStorage.setItem('token', value);
    setAuthToken(value);
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
