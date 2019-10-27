import React from 'react';

import { usePromise } from '../../hooks/use-promise';
import { Suspend } from '../../utils/suspend';
import ErrorBoundary from '../error-boundary';

type IPluginScopeTypes = 'dashboard.panel.menu'
  | 'editor.panel.menu'
  | 'editor.panel.left'
  | 'editor.panel.main'
  | 'editor.panel.right';

interface IPluginContext {
  services: Record<string, any>;
}

interface IPluginConfig {
  render: React.FC<IPluginContext>;
  [key: string]: any;
}

export interface IPluginInterface {
  'dashboard.panel.menu'?: IPluginConfig;
  'editor.panel.menu'?: IPluginConfig;
  'editor.panel.left'?: IPluginConfig;
  'editor.panel.main'?: IPluginConfig;
  'editor.panel.right'?: IPluginConfig;
}

interface IPluginProps {
  wrapper?: React.FC<{ config: Record<string, any>}>;
  scope: IPluginScopeTypes;
  src: () => Promise<any>;
}

const Plugin: React.FC<IPluginProps> = React.memo(({ wrapper: Wrapper, scope, src }) => {
  const [result, error, state] = usePromise<IPluginInterface>(src, [scope, src]);

  if (error) {
    // tslint:disable-next-line: no-console
    console.warn('[Plugin] Failed to load', error);
  }

  if (state === 'pending') {
    return <Suspend />;
  }

  const pluginConfig = result && result[scope];

  if (!pluginConfig) {
    return null;
  }

  if (typeof pluginConfig.render !== 'function') {
    return null;
  }

  const { render: PluginComponent, ...pluginData } = pluginConfig;
  const context = {
    services: {},
    config: pluginData,
  };

  if (!Wrapper) {
    return <PluginComponent {...context} />;
  }

  return (
    <Wrapper config={pluginData}>
      <PluginComponent {...context} />
    </Wrapper>
  );
}, () => false);

export interface IPluginsProps {
  scope: IPluginScopeTypes;
  render?: React.FC<{ config: Record<string, any> }>;
  src: Record<string, () => Promise<any>>;
}

const Plugins: React.FC<IPluginsProps> = ({ scope, render: Render, src }) => {
  const pluginList = Object.entries(src);

  return (
    <ErrorBoundary silent={true}>
      {pluginList.map(([key, plugin]) => (
        <Plugin wrapper={Render} key={`plugin-${key}`} scope={scope} src={plugin} />
      ))}
    </ErrorBoundary>
  );
};

export default Plugins;
