import { hot } from 'react-hot-loader/root';
import React from 'react';
import Store from 'statux';
import Counter from './Counter';
// import logo from './logo.svg';
import styles from './App.module.css';

import ApolloClient from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  fetch: window.fetch,
});

const GET_CURRENCIES = gql`
  {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

const ExchangeRates: React.FC = () => {
  const { loading, error, data } = useQuery(GET_CURRENCIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.rates
    .slice(0, 5)
    .map(({ currency, rate }: any) => (
      <div key={currency}>
        <p>
          {currency}: {rate}
        </p>
      </div>
    ));
}

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Store user={null} books={[]}>
        <div className={styles.app}>
          <header className={styles.header}>
            <Counter />
            <ExchangeRates />
          </header>
        </div>
      </Store>
    </ApolloProvider>
  );
}

export default hot(App);
