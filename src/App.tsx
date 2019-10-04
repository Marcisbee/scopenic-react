import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import Store from 'statux';
import Counter from './Counter';
// import logo from './logo.svg';
import styles from './App.module.css';

import ApolloClient from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { useLocation, useParams, useHistory } from 'react-router';

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

function queryString(value: string): Record<string, string> {
  if (!value) return {};

  return value
    .substring(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, pair) => {
      const [key, value] = pair.map(decodeURIComponent);
      return ({ ...obj, [key]: value })
    }, {});
}

const ExchangeRates: React.FC = () => {
  const { loading, error, data } = useQuery(GET_CURRENCIES);
  let location = useLocation();
  let history = useHistory();
  let params = useParams();
  
  useEffect(() => {
    console.log({
      location,
      history,
      params,
      queryString: queryString(location.search),
    });
  }, []);

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
        <Router>
          <div className={styles.app}>
            <header className={styles.header}>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
              <Switch>
                <Route exact path="/" component={Counter} />
                <Route path="/contact" component={ExchangeRates} />
              </Switch>
              {/* <Counter />
              <ExchangeRates /> */}
            </header>
          </div>
        </Router>
      </Store>
    </ApolloProvider>
  );
}

export default hot(App);
