import React from 'react';

import Plugins from '../../../../components/plugins';
import { useStore } from '../../../../utils/store';
import { useEditorState } from '../../context/editor-context';

import styles from './editor-left.module.scss';

// Plugins
const enabledPlugins = {
  'layers-menu-button': () => import('../../../../plugins/editor/layers'),
};

const EditorLeft: React.FC = () => {
  const { project } = useEditorState();
  const [panelLeftActive] = useStore<string>('editor.panel.left.active');

  return (
    <>
      <div className={styles.details}>
        Project name: {project.name}
      </div>
      <div className={styles.leftPlugins}>
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
      </div>
    </>
  );
};

export default EditorLeft;
