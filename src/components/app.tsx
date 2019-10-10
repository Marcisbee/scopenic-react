import { hot } from 'react-hot-loader/root';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import { AuthProvider } from '../context/auth';
import GraphqlProvider from '../graphql';

import styles from './app.module.css';
import Layout from './layout';
import LoadingMessage from './loading-message';
import Logout from './logout';

// function queryString(value: string): Record<string, string> {
//   if (!value) return {};

//   return value
//     .substring(1)
//     .split('&')
//     .map(p => p.split('='))
//     .reduce((obj, pair) => {
//       const [key, value] = pair.map(decodeURIComponent);
//       return ({ ...obj, [key]: value })
//     }, {});
// }

const App: React.FC = () => {
  return (
    <GraphqlProvider>
      {/* <Store user={null}> */}
        <AuthProvider>
          <Router>
            <Layout>
              <div className={styles.app}>
                <header className={styles.header}>
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/settings">Settings</Link>
                    </li>
                  </ul>
                  <Logout>Log out</Logout>
                </header>
                <hr/>
                <Suspense fallback={<LoadingMessage />}>
                  <Switch>
                    <Route exact path="/" component={lazy(() => import('../routes/home'))} />
                    <Route exact path="/settings" component={lazy(() => import('../routes/settings'))} />
                  </Switch>
                </Suspense>
              </div>
            </Layout>
          </Router>
        </AuthProvider>
      {/* </Store> */}
    </GraphqlProvider>
  );
}

export default hot(App);
