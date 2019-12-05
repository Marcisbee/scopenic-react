// import cc from 'classcat';
import { useQuery } from '@apollo/react-hooks';
import React, { useMemo } from 'react';
import { useParams } from 'react-router';

import Plugins from '../../components/plugins';
import { GET_PROJECT_BY_ID } from '../../graphql/queries';
import { GetProjectById } from '../../graphql/queries/types/GetProjectById';
import { RefsContext, RefsContextInitial } from '../../utils/refs-context';
import { Suspend } from '../../utils/suspend';

import EditorLeft from './components/editor-left';
import EditorRight from './components/editor-right';
import Workspace from './components/workspace';
import { OverlayContext } from './components/workspace/context/overlay';
import { EditorStore, IEditorState, IProjectState, IState } from './context/editor-context';
import styles from './editor.module.scss';

// Plugins
const enabledPlugins = {
  // 'hello-world': () => import('../plugins/panel/hello-world'),
  // 'layers-menu-button': () => import('../../plugins/editor/layers'),
};

const Editor: React.FC = () => {
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<GetProjectById>(GET_PROJECT_BY_ID, { variables: { id: params.id } });
  const project = useMemo<IProjectState | undefined>(() => {
    if (error || loading || !data || !data.project) {
      return;
    }

    return {
      ...data.project,
      data: JSON.parse(data.project.data),
    };
  }, [data]);
  const projectState = useMemo<IState | undefined>(() => {
    if (!project || !data || !data.project) {
      return;
    }

    return {
      activeWorkspace: {
        type: 'page',
        route: '/',
      },
      activeElement: {
        id: null,
        path: ['0'],
      },
      data: JSON.parse(data.project.data),
    };
  }, [project]);

  const settings = {};

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

  // @TODO: Use dataset from API
  const dataset = {
    user: {
      name: 'John Wick',
    },
    articles: [
      {
        title: 'Beyond the Rocks',
        text: 'It Happened Tomorrow',
      },
      {
        title: 'Ann Carver\'s Profession',
        text: 'Class Action',
      },
      {
        title: 'Is Paris Burning? (Paris brûle-t-il?)',
        text: 'Witch Way Love (Un amour de sorcière)',
      },
    ],
  };

  const initialData: Partial<IEditorState> = {
    settings,
    project,
    state: projectState,
    dataset,
  };

  return (
    <RefsContext.Provider value={RefsContextInitial}>
      <OverlayContext.Provider>
        <EditorStore.Provider initialData={initialData}>
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
        </EditorStore.Provider>
      </OverlayContext.Provider>
    </RefsContext.Provider>
  );
};

export default Editor;
