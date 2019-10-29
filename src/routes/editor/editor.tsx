// import cc from 'classcat';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import Frame from 'react-frame-component';
import { useParams } from 'react-router';

import Plugins from '../../components/plugins';
import { GET_PROJECT_BY_ID } from '../../graphql/queries';
import { useStore } from '../../utils/store';
import { Suspend } from '../../utils/suspend';

import styles from './editor.module.scss';

// Plugins
const enabledPlugins = {
  // 'hello-world': () => import('../plugins/panel/hello-world'),
  'layers-menu-button': () => import('../../plugins/editor/layers'),
};

const Editor: React.FC = () => {
  // @TODO: Move LEFT, Middle and right side to seperate components
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_PROJECT_BY_ID, { variables: { id: params.id }});
  const [panelLeftActive] = useStore<string>('editor.panel.left.active');

  if (loading) {
    return <Suspend />;
  }

  if (error) {
    // @TODO: Catch this error in layout level
    throw error;
  }

  if (!data || !data.project) {
    // @TODO: Create generic cool style for non-ideal state
    return <>No project found</>;
  }

  const { project } = data;

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
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
        <div>
          {/* https://github.com/ryanseddon/react-frame-component */}
          <Frame>
            <h1>Hello world</h1>
            <pre>{JSON.stringify(JSON.parse(project.data), null, '  ')}</pre>
          </Frame>
        </div>
        <Plugins
          scope="editor.panel.main"
          src={enabledPlugins}
        />
      </div>
    </div>
  );
};

export default Editor;
