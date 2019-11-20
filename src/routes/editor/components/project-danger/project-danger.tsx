import { useMutation } from '@apollo/react-hooks';
import cc from 'classcat';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Alert from '../../../../components/alert/alert';
import { ARCHIVE_PROJECT } from '../../../../graphql/mutations/projects';
import { ArchiveProject, ArchiveProjectVariables } from '../../../../graphql/mutations/types/ArchiveProject';
import sharedStyles from '../../../../shared.module.scss';
import { formatErrorMessage } from '../../../../utils/format-error-message';
import { EditorStore } from '../../context/editor-context';

const ProjectDanger: React.FC = () => {
  const history = useHistory();
  const [status, setStatus] = useState<Record<string, any>>({});
  const project = EditorStore.useStoreState((s) => s.project);
  const [archiveProject, { loading: loadingArchiveProject }] = useMutation<ArchiveProject, ArchiveProjectVariables>(ARCHIVE_PROJECT);

  const onRemove = async () => {
    // @TODO: Replace confirm popup with custom component
    if (!confirm('Really want to delete?')) {
      return;
    }

    history.replace('/');

    await archiveProject({
      variables: {
        id: project.id,
      },
    })
      .then((response) => {
        if (!response.data || !response.data.archiveProject) {
          throw new Error('Something went wrong');
        }

        history.replace('/');
      })
      .catch((error) => {
        const errorMessage = formatErrorMessage(error, () => { });

        if (!errorMessage) {
          return;
        }

        setStatus({ error: errorMessage });
      });
  };

  return (
    <div>
      <Alert
        show={!!status.error}
        type="danger"
        title="Error ocurred"
        description={status.error}
      />

      {/* <div className={sharedStyles.cta}>
        <button
          className="pt-button pt-intent-danger f-right"
        >
          Make private
        </button>
        <strong>Make this project private</strong>
        <p>Hide this project from public</p>
      </div>

      <hr /> */}

      <div className={sharedStyles.cta}>
        <button
          className={cc([
            'pt-button pt-large pt-intent-danger f-right',
            loadingArchiveProject && 'pt-loading',
          ])}
          disabled={loadingArchiveProject}
          onClick={onRemove}
        >
          Delete this project
        </button>
        <strong>Delete this project</strong>
        <p>Once you delete a project, there is no going back</p>
      </div>
    </div>
  );
};

export default ProjectDanger;
