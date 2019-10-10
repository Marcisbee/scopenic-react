import React from 'react';

import { useAuth } from '../../context/auth';

const Layout: React.FC = ({ children, ...props }) => {
  const { authClient, removeAuthToken } = useAuth();

  return (
    <button {...props} onClick={() => {
      authClient && authClient.resetStore();
      removeAuthToken();
    }}>
      {children}
    </button>
  );
}

export default Layout;
