import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useAuth } from '../../context/auth';
import { GET_CURRENT_USER } from '../../graphql/queries';

const Layout: React.FC = ({ children }) => {
  const { authToken, setUserData } = useAuth();
  const { data, refetch } = useQuery(
    GET_CURRENT_USER,
    { fetchPolicy: 'network-only' },
  );

  useEffect(() => {
    if (authToken) {
      refetch();
    }
  }, [authToken]);

  useEffect(() => {
    setUserData(data && data.currentUser);
  }, [data]);

  return <>{children}</>;
}

export default Layout;
