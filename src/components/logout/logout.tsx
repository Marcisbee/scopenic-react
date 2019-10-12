import React from 'react';

import { useAuth } from '../../context/auth';

const Logout: React.FC<any> = ({ children, ...props }) => {
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

export default Logout;
