import { useMutation } from '@apollo/react-hooks';
import jsondiffpatch from '@as-com/jsondiffpatch';
import cc from 'classcat';
import React, { useEffect } from 'react';

import Plugins from '../../../../components/plugins';
import { COMMIT } from '../../../../graphql/mutations/projects';
import { useStore } from '../../../../utils/store';
import { useEditorDispatch, useEditorState } from '../../context/editor-context';

import styles from './editor-left.module.scss';

// Plugins
const enabledPlugins = {
  'layers': () => import('../../../../plugins/editor/layers'),
  'dataset': () => import('../../../../plugins/editor/dataset'),
};

const createJsonDiff = (jsondiffpatch as any).create({
  cloneDiffValues: false,
});

const EditorLeft: React.FC = () => {
  const [commit, { data, loading, error }] = useMutation(COMMIT);
  const { project, state } = useEditorState();
  const { setProjectData } = useEditorDispatch();
  const [panelLeftActive] = useStore<string>('editor.panel.left.active');

  useEffect(() => {
    if (!error && !loading && data) {
      setProjectData(JSON.parse(JSON.stringify(state.data)));
      console.log('Changes saved');
    }
  }, [error, loading, data]);

  function commitChanges() {
    const diff = createJsonDiff.diff(
      project.data,
      state.data,
    );

    if (!diff) {
      console.log('Nothing to commit');
      return;
    }

    const variables = {
      name: 'Unnamed',
      description: '',
      content: JSON.stringify(diff),
      project_id: project.id,
    };

    commit({ variables });
  }

  return (
    <>
      <div className={styles.details}>
        Project name: {project.name}

        <div>
          <button
            className={cc(['pt-button pt-intent-primary', { 'pt-loading': loading }])}
            onClick={commitChanges}
            disabled={loading}
          >
            Commit changes
          </button>
        </div>
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
