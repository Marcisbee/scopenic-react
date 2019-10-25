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
        LEFT
        <Plugins
          scope="editor.panel.left"
          src={enabledPlugins}
          render={({ children: child }) => (
            <div>
              {child}
            </div>
          )}
        />
      </div>
      <div className={styles.right}>RIGHT</div>
      <div className={styles.main}>MIDDLE</div>
    </div>
  );
};

export default Editor;
