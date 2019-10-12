import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useAuth } from '../../context/auth';
import { GET_CURRENT_USER } from '../../graphql/queries';

const Layout: React.FC = ({ children }) => {
  const { authToken } = useAuth();
  const { refetch } = useQuery(
    GET_CURRENT_USER,
    { fetchPolicy: 'network-only' },
  );

  useEffect(() => {
    if (authToken) {
      refetch();
    }
  }, [authToken]);


  return <>{children}</>;
}

export default Layout;
