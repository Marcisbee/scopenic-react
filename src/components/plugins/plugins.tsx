import React from 'react';

import { usePromise } from '../../hooks/use-promise';
import { Suspend } from '../../utils/suspend';

type IPluginScopeTypes = 'dashboard.panel.menu' | 'editor.panel.menu';

interface IPluginContext {
  services: Record<string, any>;
}

type IPluginInterface = Record<
  IPluginScopeTypes,
  (ctx: IPluginContext) => React.ReactNode
>;

interface IPluginProps {
  scope: IPluginScopeTypes;
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
  const PluginComponent = result[scope] as any;

  return <PluginComponent {...context} />;
}, () => false);

export interface IPluginsProps {
  scope: IPluginScopeTypes;
  render?: React.FC;
  src: Record<string, () => Promise<any>>;
}

const Plugins: React.FC<IPluginsProps> = ({ scope, render: Render, src }) => {
  const pluginList = Object.values(src);

  return (
    <>
      {pluginList.map((plugin, index) => (
        Render
          ? <Render key={`wrapper-${plugin.toString()}-${index}`}><Plugin scope={scope} src={plugin} /></Render>
          : <Plugin key={`plugin-${plugin.toString()}-${index}`} scope={scope} src={plugin} />
      ))}
    </>
  );
};

export default Plugins;
