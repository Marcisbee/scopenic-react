// import 'regenerator-runtime/runtime';
// import 'core-js/es6';
// import 'tslib';

import * as React from 'react';
import { render } from 'react-dom';
// import { hot } from 'react-hot-ts';

import App from './components/app';
import './index.scss';
// import * as serviceWorker from './serviceWorker';

if (process.env.NODE_ENV === 'development') {
  // tslint:disable-next-line: no-implicit-dependencies
  require('panic-overlay');
}

// hot(module)(render(<App />, document.getElementById('root')));
render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
