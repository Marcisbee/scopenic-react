import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import { useAuth } from '../../context/auth';

const Logout: React.FC<any> = ({ children, ...props }) => {
  const client = useApolloClient();
  const { removeAuthToken } = useAuth();

  return (
    <a {...props} onClick={() => {
      client.resetStore();
      removeAuthToken();
    }}>
      {children}
    </a>
  );
}

export default Logout;
