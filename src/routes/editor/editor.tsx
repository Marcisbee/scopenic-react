// import cc from 'classcat';
import React from 'react';

import Plugins from '../../components/plugins';
import { useStore } from '../../utils/store';

import styles from './editor.module.scss';

// Plugins
const enabledPlugins = {
  // 'hello-world': () => import('../plugins/panel/hello-world'),
  'layers-menu-button': () => import('../../plugins/editor/layers'),
};

const Editor: React.FC = () => {
  // @TODO: Move LEFT, Middle and right side to seperate components
  const [panelLeftActive] = useStore<string>('editor.panel.left.active');

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.details}>
          Project name
        </div>
        <div className={styles.leftPlugins}>
          {panelLeftActive === 'layers' && (
            <Plugins
              scope="editor.panel.left"
              src={enabledPlugins}
              render={({ config: pluginConfig, children }) => (
                <>
                  {
                    panelLeftActive === pluginConfig.action && (
                      children
                    )
                  }
                </>
              )}
            />
          )}
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
