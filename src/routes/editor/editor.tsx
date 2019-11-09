// import cc from 'classcat';
import { useQuery } from '@apollo/react-hooks';
import React, { useLayoutEffect, useRef, useState } from 'react';
import Frame from 'react-frame-component';
import { useParams } from 'react-router';

import Plugins from '../../components/plugins';
import { GET_PROJECT_BY_ID } from '../../graphql/queries';
import { createVNode } from '../../utils/create-vnode';
import { Suspend } from '../../utils/suspend';
import Workspace from './components/workspace';

import EditorLeft from './components/editor-left';
import EditorRight from './components/editor-right';
import { EditorProvider } from './context/editor-context';
import styles from './editor.module.scss';

// Plugins
const enabledPlugins = {
  // 'hello-world': () => import('../plugins/panel/hello-world'),
  // 'layers-menu-button': () => import('../../plugins/editor/layers'),
};

const Editor: React.FC = () => {
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_PROJECT_BY_ID, { variables: { id: params.id } });
  const [project, setProject] = useState(data);
  const [projectState, setProjectState] = useState<any>(null);
  const workspaceRef = useRef<Frame>(null);

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
          createVNode('component', 'header', undefined, undefined, [
            createVNode('text', 'Hello {name} !'),
          ]),
          createVNode('node', 'button', undefined, {
            className: 'btn',
          }, [
            createVNode('text', 'Click here'),
          ]),
          createVNode('node', 'div', undefined, undefined, [
            createVNode('node', 'div'),
            createVNode('node', 'img'),
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

  const initialEditorState = {
    settings,
    project,
    state: projectState,
    workspaceRef,
  };

  return (
    <EditorProvider initialState={initialEditorState}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <EditorLeft />
        </div>

        <div className={styles.right}>
          <EditorRight />
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
    </EditorProvider>
  );
};

export default Editor;
