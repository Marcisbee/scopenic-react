import { useMutation } from '@apollo/react-hooks';
// @ts-ignore
import * as jsondiffpatch from '@as-com/jsondiffpatch/dist/jsondiffpatch.cjs';
import cc from 'classcat';
import React, { useEffect, useState } from 'react';

// import Plugins from '../../../../components/plugins';
import FormModal from '../../../../components/form-modal/form-modal';
import { DangerIcon, ProjectIcon } from '../../../../components/icons';
import ProjectIconComponent from '../../../../components/project-icon/project-icon';
import SettingsBlock from '../../../../components/settings-block/settings-block';
import { UiStore } from '../../../../context/ui-context';
import { COMMIT } from '../../../../graphql/mutations/projects';
import { Commit, CommitVariables } from '../../../../graphql/mutations/types/Commit';
import { EditorStore } from '../../context/editor-context';
import ProjectDanger from '../project-danger/project-danger';
import ProjectDetails from '../project-details/project-details';

import styles from './editor-left.module.scss';

// Plugins
// const enabledPlugins = {
//   'layers': () => import('../../../../plugins/editor/layers'),
//   'dataset': () => import('../../../../plugins/editor/dataset'),
// };

import commitHistory from '../../../../plugins/editor/commit-history';
import dataset from '../../../../plugins/editor/dataset';
import layers from '../../../../plugins/editor/layers';

const CommitHistoryPlugin = (commitHistory['editor.panel.left'] as any).render;
const DatasetPlugin = (dataset['editor.panel.left'] as any).render;
const LayersPlugin = React.memo((layers['editor.panel.left'] as any).render, () => true);

const createJsonDiff = (jsondiffpatch as any).create({
  cloneDiffValues: false,
});

const EditorLeft: React.FC = () => {
  const [commit, { data, loading, error }] = useMutation<Commit, CommitVariables>(COMMIT);
  const [editProject, setEditProject] = useState(false);
  const { project, state } = EditorStore.useStoreState((s) => s);
  const { setProjectData } = EditorStore.useStoreActions((s) => s);
  const panelLeftActive = UiStore.useStoreState((s) => s.panel.left.active);

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
        <div className={styles.icon}>
          <ProjectIconComponent size={40} src={project.icon} />
        </div>

        <div className={styles.data}>
          <strong>{project.name}</strong>
          <span>
            by <strong>{project.owner.name}</strong>
          </span>
        </div>

        <button
          className={cc([styles.edit, 'pt-button'])}
          onClick={() => setEditProject(true)}
        >
          <i className="im im-pencil" />
        </button>

        {editProject && (
          <FormModal width={600} close={() => {
            setEditProject(false);
          }}>
            <SettingsBlock
              icon={
                <ProjectIcon className="sc-settings-icon-fg" />
              }
              color="#0a8ffb"
              title="Project details"
              description="General project settings"
              open={true}
            >
              <ProjectDetails />
            </SettingsBlock>

            <SettingsBlock
              icon={
                <DangerIcon className="sc-settings-icon-fg" />
              }
              color="#d62828"
              title="Danger zone"
              description="Actions that have side effects"
            >
              <ProjectDanger />
            </SettingsBlock>
          </FormModal>
        )}

        {/* <div>
          <button
            className={cc(['pt-button pt-intent-primary', { 'pt-loading': loading }])}
            onClick={commitChanges}
            disabled={loading}
          >
            Commit changes
          </button>
        </div> */}
      </div>

      <div className={styles.leftPlugins}>
        {panelLeftActive === 'layers' && (
          <LayersPlugin />
        )}
        {panelLeftActive === 'dataset' && (
          <DatasetPlugin />
        )}
        {panelLeftActive === 'commitHistory' && (
          <CommitHistoryPlugin />
        )}
        {/* <Plugins
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
        /> */}
      </div>
    </>
  );
};

export default EditorLeft;
