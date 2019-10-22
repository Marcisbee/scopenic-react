import React from 'react';

import { usePromise } from '../../hooks/use-promise';
import { Suspend } from '../../utils/suspend';

interface IPluginContext {
  services: Record<string, any>;
}

interface IPluginInterface {
  panelMenu: (ctx: IPluginContext) => React.ReactNode;
}

interface IPluginProps {
  scope: 'panelMenu';
  src: () => Promise<any>;
}

const Plugin: React.FC<IPluginProps> = React.memo(({ scope, src }) => {
  const [result, error, state] = usePromise<IPluginInterface>(src, [scope, src]);

  if (error) {
    // tslint:disable-next-line: no-console
    console.warn('[Plugin] Failed to load', error);
  }

  if (state === 'pending') {
    return <Suspend />;
  }

  if (!result) {
    return null;
  }

  if (typeof result[scope] !== 'function') {
    return null;
  }

  const context = {
    services: {},
  };
  const element = result[scope](context);

  return <>{element}</>;
}, () => false);

export interface IPluginsProps {
  scope: 'panelMenu';
  render?: React.FC;
  src: Record<string, () => Promise<any>>;
}

const Plugins: React.FC<IPluginsProps> = ({ scope, render: Render, src }) => {
  const pluginList = Object.values(src);

  return (
    <>
      {pluginList.map((plugin) => (
        Render
          ? <Render key={plugin.toString()}><Plugin scope={scope} src={plugin} /></Render>
          : <Plugin scope={scope} src={plugin} />
      ))}
    </>
  );
};

export default Plugins;
