import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import { useAuth } from '../../context/auth';

const Logout: React.FC<any> = ({ children, ...props }) => {
  const client = useApolloClient();
  const { removeAuthToken } = useAuth();

  return (
    <button {...props} onClick={() => {
      client.resetStore();
      removeAuthToken();
    }}>
      {children}
    </button>
  );
}

export default Logout;
