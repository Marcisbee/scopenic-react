import React from 'react';
import { useParams } from 'react-router-dom';

import ScopeShape from '../../../components/decorations/scope-shape';
import { LayersIcon } from '../../../components/icons';
import CustomLink from '../../../components/link';

import styles from '../../../layouts/panel.module.scss';

const Menu: React.FC = () => {
  const params = useParams<{ id: string }>();

  return (
    <CustomLink activeClassName={styles.menuActive} to={`/editor/${params.id}`}>
      <ScopeShape className={styles.menuIconBg} />
      <LayersIcon className={styles.menuIcon} />
    </CustomLink>
  );
};

export = {
  'editor.panel.menu': Menu,
};
