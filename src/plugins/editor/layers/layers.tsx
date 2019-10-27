import React from 'react';

import { LayersIcon } from '../../../components/icons';
import { IPluginInterface } from '../../../components/plugins/plugins';

import panelStyles from '../../../layouts/panel.module.scss';
import styles from './layers.module.scss';

const Menu: React.FC = () => {
  return (
    <LayersIcon className={panelStyles.menuIcon} />
  );
};

const LeftPanel: React.FC = () => {
  // const params = useParams<{ id: string }>();

  return (
    <div className={styles.wrapper}>
      Hello left side
    </div>
  );
};

const plugin: IPluginInterface = {
  'editor.panel.menu': {
    action: 'layers',
    render: Menu,
  },
  'editor.panel.left': {
    action: 'layers',
    render: LeftPanel,
  },
};

export = plugin;
