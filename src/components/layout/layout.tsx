import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useAuth } from '../../context/auth';
import { GET_CURRENT_USER } from '../../graphql/queries';
import LoadingMessage from '../loading-message';

const Layout: React.FC = ({ children }) => {
  const { authToken, userData, setUserData } = useAuth();
  const { data, loading, refetch } = useQuery(
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

  const notYetLogged = authToken && !userData;

  if (loading || notYetLogged) {
    return <LoadingMessage />;
  }

  return <>{children}</>;
}

export default Layout;
