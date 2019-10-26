// import cc from 'classcat';
import React from 'react';

import Plugins from '../../components/plugins';

import styles from './editor.module.scss';

// Plugins
const enabledPlugins = {
  // 'hello-world': () => import('../plugins/panel/hello-world'),
  'layers-menu-button': () => import('../../plugins/editor/layers'),
};

const Editor: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.details}>
          Project name
        </div>
        <div className={styles.leftPlugins}>
          <Plugins
            scope="editor.panel.left"
            src={enabledPlugins}
          />
        </div>
      </div>
      <div className={styles.right}>
        RIGHT
        <Plugins
          scope="editor.panel.right"
          src={enabledPlugins}
        />
      </div>
      <div className={styles.main}>
        MAIN
        <Plugins
          scope="editor.panel.main"
          src={enabledPlugins}
        />
      </div>
    </div>
  );
};

export default Editor;
