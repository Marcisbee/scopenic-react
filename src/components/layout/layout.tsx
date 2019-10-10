import React, { lazy, useEffect, Suspense } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useAuth } from '../../context/auth';
import { GET_CURRENT_USER } from '../../graphql/queries';

import LoadingMessage from '../loading-message';
const Login = lazy(() => import('../../routes/login/login'));

const Layout: React.FC = ({ children }) => {
  const { authToken, setAuthClient } = useAuth();
  const { client, loading, data, refetch } = useQuery(
    GET_CURRENT_USER,
    { fetchPolicy: 'network-only' },
  );

  useEffect(() => {
    if (authToken) {
      refetch();
      setAuthClient(client);
    }
  }, [authToken]);

  if (loading) {
    return <LoadingMessage />;
  }

  if (data && data.currentUser) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<LoadingMessage />}>
      <Login />
    </Suspense>
  );
}

export default Layout;
