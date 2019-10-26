import React from 'react';
import { useParams } from 'react-router-dom';

import ScopeShape from '../../../components/decorations/scope-shape';
import { LayersIcon } from '../../../components/icons';
import CustomLink from '../../../components/link';

import panelStyles from '../../../layouts/panel.module.scss';
import styles from './layers.module.scss';

const Menu: React.FC = () => {
  const params = useParams<{ id: string }>();

  return (
    <CustomLink activeClassName={panelStyles.menuActive} to={`/editor/${params.id}`}>
      <ScopeShape className={panelStyles.menuIconBg} />
      <LayersIcon className={panelStyles.menuIcon} />
    </CustomLink>
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

export = {
  'editor.panel.menu': Menu,
  'editor.panel.left': LeftPanel,
};
