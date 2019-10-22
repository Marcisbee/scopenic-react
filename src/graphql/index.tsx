import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';

const API_URL = process.env.API_URL;

const client = new ApolloClient({
  fetch: window.fetch,
  onError: ({ networkError }) => {
    if (networkError
      && (networkError as any).statusCode === 401
      && (networkError as any).result === 'invalid token') {
      // @TODO: Deal with expired/invalid token
      // tslint:disable-next-line: no-console
      console.log('INVALID token');
    }
  },
  request: (operation) => {
    const token = localStorage.getItem('token');

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
  uri: API_URL,
});

const GraphqlProvider: React.FC = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};

export default GraphqlProvider;
