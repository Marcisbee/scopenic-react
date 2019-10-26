import React, { lazy, Suspense } from 'react';
// import { hot } from 'react-hot-ts';
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Store from 'statux';

import GraphqlProvider from '../graphql';
import { ProvideAuth, useAuth } from '../hooks/use-auth';
import Store from '../utils/store';
import StoreDevtools from '../utils/store-devtools';
import { Suspend } from '../utils/suspend';

import Spinner from './spinner';

const Layouts = {
  panel: lazy(() => import('../layouts/panel')),
};

const Routes = {
  login: lazy(() => import('../routes/login')),

  projects: lazy(() => import('../routes/projects')),
  settings: lazy(() => import('../routes/settings')),

  editor: lazy(() => import('../routes/editor')),
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

const PrivateRoute: React.FC<any> = (props) => {
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
    return <Route {...props}/>;
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

// Enable devtools in development mode
const GlobalStore = (process.env.NODE_ENV === 'production') ? Store : StoreDevtools(Store);

const initialStore = {
  user: null,
};

const App: React.FC = () => {
  return (
    <GraphqlProvider>
      <GlobalStore {...initialStore}>
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

                <PrivateRoute path="/editor/:id">
                  <Layouts.panel type="editor">
                    <Routes.editor />
                  </Layouts.panel>
                </PrivateRoute>

                <PrivateRoute
                  path={[
                    '/projects',
                    '/settings',
                  ]}
                >
                  <Layouts.panel type="dashboard">
                    <Switch>
                      <Route exact={true} path="/projects">
                        <Routes.projects />
                      </Route>
                      <Route exact={true} path="/settings">
                        <Routes.settings />
                      </Route>
                    </Switch>
                  </Layouts.panel>
                </PrivateRoute>

                <Route path="*">
                  Error 404
                </Route>
              </Switch>
            </Suspense>
          </ProvideAuth>
        </Router>
      </GlobalStore>
    </GraphqlProvider>
  );
};

// export default hot(module)(App);
export default App;
