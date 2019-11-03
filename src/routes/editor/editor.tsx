// import cc from 'classcat';
import { useQuery } from '@apollo/react-hooks';
import dlv from 'dlv';
import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router';

import Plugins from '../../components/plugins';
import Workspace from '../../components/workspace';
import { GET_PROJECT_BY_ID } from '../../graphql/queries';
import { createVNode } from '../../utils/create-vnode';
import { useStore } from '../../utils/store';
import { Suspend } from '../../utils/suspend';

import styles from './editor.module.scss';

// Plugins
const enabledPlugins = {
  // 'hello-world': () => import('../plugins/panel/hello-world'),
  'layers-menu-button': () => import('../../plugins/editor/layers'),
};

export const projectContext = React.createContext<{
  project: Record<string, any>,
  settings: Record<string, any>,
  state: Record<string, any>,
  setProject: React.Dispatch<Record<string, any>>,
  setState: React.Dispatch<Record<string, any>>,
}>({} as any);

const Editor: React.FC = () => {
  // @TODO: Move LEFT, Middle and right side to seperate components
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_PROJECT_BY_ID, { variables: { id: params.id }});
  const [project, setProject] = useState(data);
  const [projectState, setProjectState] = useState<any>(null);
  const [panelLeftActive] = useStore<string>('editor.panel.left.active');

  const settings = {
    page: '/',
  };

  useLayoutEffect(() => {
    if (!data) {
      return;
    }

    const projectStructure = {
      '/': {
        name: 'Home',
        children: [
          createVNode('component', 'header', undefined, [
            // @TODO: Figure out if variable should be used like this or inside text node
            // YES in text nodes!!
            createVNode('text', 'Hello '),
            createVNode('var', 'name'),
            createVNode('text', '!'),
          ]),
          createVNode('node', 'div', undefined, [
            createVNode('node', 'div'),
            createVNode('img', 'img'),
          ]),
        ],
      },
    };
    const tempProjectState = {
      ...data.project,
      data: projectStructure,
      css: {
        [projectStructure['/'].children[1].id]: {
          backgroundColor: 'orange',
          color: 'white',
        },
      },
    };
    setProject(tempProjectState);
    setProjectState({
      activePage: settings.page,
      activeElement: {
        id: null,
        path: [0],
      },
      data: tempProjectState.data,
      css: tempProjectState.css,
    });
  }, [data]);

  if (loading || (data && !projectState)) {
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

  return (
    <projectContext.Provider value={{
      settings,
      project,
      state: projectState,
      // @TODO: create reducers
      setProject,
      setState: setProjectState,
    }}>
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
          <div>
            Selected element: {JSON.stringify(projectState.activeElement)}
            <h2>Element:</h2>
            <pre>{JSON.stringify(
              dlv(projectState.data[projectState.activePage], 'children.' + projectState.activeElement.path.slice(1).join('.children.')),
              // Don't care about children data here
              (key, value) => key === 'children' ? undefined : value,
              '  ',
            )}</pre>
            <h2>Styles:</h2>
            {projectState.activeElement.id && (
              <pre>{JSON.stringify(
                dlv(projectState.css, projectState.activeElement.id),
                null,
                '  ',
              )}</pre>
            )}
          </div>
          <Plugins
            scope="editor.panel.right"
            src={enabledPlugins}
          />
        </div>
        <div className={styles.main}>
          <Workspace />
          <Plugins
            scope="editor.panel.main"
            src={enabledPlugins}
          />
        </div>
      </div>
    </projectContext.Provider>
  );
};

export default Editor;
