import { hot } from 'react-hot-loader/root';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Store from 'statux';

import { AuthProvider, useAuth } from '../context/auth';
import GraphqlProvider from '../graphql';

import Layout from './layout';
import LoadingMessage from './loading-message';

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

const PrivateRoute: React.FC<any> = (props) => {
  const { component: Component, ...rest } = props;
  const { authToken } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

const Layouts = {
  Panel: lazy(() => import('../layouts/panel')),
};

const Routes = {
  Projects: lazy(() => import('../routes/projects')),
  Settings: lazy(() => import('../routes/settings')),
};

const App: React.FC = () => {
  return (
    <GraphqlProvider>
      <Store user={null}>
        <Router>
          <AuthProvider>
            <Layout>
              <Suspense fallback={<LoadingMessage />}>
                <Switch>
                  <Route exact path="/">
                    <Redirect to="/login" />
                  </Route>
                  <Route exact path="/login" component={lazy(() => import('../routes/login'))} />
                  <PrivateRoute exact path="/projects" component={() => (
                    <Layouts.Panel>
                      <Routes.Projects />
                    </Layouts.Panel>
                  )} />
                  <PrivateRoute exact path="/settings" component={() => (
                    <Layouts.Panel>
                      <Routes.Settings />
                    </Layouts.Panel>
                  )} />
                </Switch>
              </Suspense>
            </Layout>
          </AuthProvider>
        </Router>
      </Store>
    </GraphqlProvider>
  );
}

export default hot(App);
