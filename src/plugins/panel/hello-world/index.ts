// tslint:disable-next-line: no-implicit-dependencies
import React from 'react';

export = {
  'dashboard.panel.menu': (): React.ReactNode => {
    console.log('got loaded');
    // "translate" was a service this plugin consumes
    // const { translate } = ctx.services;
    // const { menu } = ctx;

    return 'Hello world';
  },
};
