import React, { lazy, Suspense } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Store from 'statux';

import GraphqlProvider from '../graphql';
import { ProvideAuth, useAuth } from '../hooks/use-auth';

import Spinner from './spinner';

const Layouts = {
  panel: lazy(() => import(/* webpackChunkName: "panel" */ '../layouts/panel')),
};

const Routes = {
  login: lazy(() => import(/* webpackChunkName: "login" */ '../routes/login')),

  projects: lazy(() => import(/* webpackChunkName: "projects" */ '../routes/projects')),
  settings: lazy(() => import(/* webpackChunkName: "settings" */ '../routes/settings')),
};

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

const Suspend: React.FC = () => {
  throw new Promise((r) => r());
};

const PrivateRoute: React.FC<any> = (props) => {
  const { children } = props;
  const { token, user, error, signout } = useAuth();
  const location = useLocation();

  if (error && token) {
    return (
      <div>
        <h1>Your session has expired</h1>
        <p>{JSON.stringify(error)}</p>
        <button onClick={signout}>Try to sign in</button>
      </div>
    );
  }

  if (token && !user) {
    return <Suspend />;
  }

  if (user) {
    return <>{children}</>;
  }

  return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: location },
      }}
    />
  );
};

const App: React.FC = () => {
  return (
    <GraphqlProvider>
      <Store user={null}>
        <Router>
          <ProvideAuth>
            <Suspense fallback={<Spinner type="full" />}>
              <Switch>
                <Route
                  exact={true}
                  path="/"
                  component={() => (
                    <Redirect to="/login" />
                  )}
                />
                <Route
                  exact={true}
                  path="/login"
                  component={() => (
                    <Routes.login />
                  )}
                />

                <PrivateRoute
                  exact={true}
                  path={[
                    '/projects',
                    '/settings',
                  ]}
                >
                  <Layouts.panel>
                    <Route
                      exact={true}
                      path="/projects"
                      component={() => (
                        <Routes.projects />
                      )}
                    />
                    <Route
                      exact={true}
                      path="/settings"
                      component={() => (
                        <Routes.settings />
                      )}
                    />
                  </Layouts.panel>
                </PrivateRoute>

                <Route path="*">
                  Error 404
                </Route>
              </Switch>
            </Suspense>
          </ProvideAuth>
        </Router>
      </Store>
    </GraphqlProvider>
  );
};

export default hot(App);
