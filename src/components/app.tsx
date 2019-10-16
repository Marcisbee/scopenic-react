import React, { lazy, Suspense } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Store from 'statux';

import GraphqlProvider from '../graphql';
import { ProvideAuth, useAuth } from '../hooks/use-auth';

import Spinner from './spinner';

const layouts = {
  Panel: {
    component: lazy(() => import(/* webpackChunkName: "panel" */ '../layouts/panel')),
    routes: {
      '/projects': lazy(() => import(/* webpackChunkName: "projects" */ '../routes/projects')),
      '/settings': lazy(() => import(/* webpackChunkName: "settings" */ '../routes/settings')),
    },
  },
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
  const { component: Component, ...rest } = props;
  const { token, user, error, signout } = useAuth();

  if (error && token) {
    return (
      <div>
        <h1>Error</h1>
        <p>{JSON.stringify(error)}</p>
        <button onClick={signout}>Try to sign in</button>
      </div>
    );
  }

  if (token && !user) {
    return <Suspend />;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
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
                <Route exact={true} path="/">
                  <Redirect to="/login" />
                </Route>
                <Route exact={true} path="/login" component={lazy(() => import(/* webpackChunkName: "login" */ '../routes/login'))} />
                {Object.values(layouts).map(({ component: LayoutComponent, routes }) => {
                  const routeKeys = Object.keys(routes);

                  return (
                    <PrivateRoute
                      key={routeKeys.join('')}
                      exact={true}
                      path={routeKeys}
                      component={() => (
                        <LayoutComponent>
                          {routeKeys.map((path) => {
                            const RouteComponent = (routes as any)[path];

                            return (
                              <Route
                                key={path}
                                exact={true}
                                path={path}
                                component={() => (
                                  <RouteComponent />
                                )}
                              />
                            );
                          })}
                        </LayoutComponent>
                      )}
                    />
                  );
                })}
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
