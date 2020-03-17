import React from 'react';

import { CommitHistoryIcon } from '../../../components/icons';
import { IPluginInterface } from '../../../components/plugins/plugins';
import panelStyles from '../../../layouts/panel.module.scss';

import styles from './commit-history.module.scss';

const Menu: React.FC = () => {
  return (
    <CommitHistoryIcon className={panelStyles.menuIcon} />
  );
};

const LeftPanel: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div>
        Hello world
      </div>
    </div>
  );
};

const plugin: IPluginInterface = {
  'editor.panel.menu': {
    action: 'commitHistory',
    render: Menu,
  },
  'editor.panel.left': {
    action: 'commitHistory',
    render: LeftPanel,
  },
};

export default plugin;
