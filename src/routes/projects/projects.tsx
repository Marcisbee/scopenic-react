import { useQuery } from '@apollo/react-hooks';
import React, { Suspense, useState } from 'react';

import Alert from '../../components/alert/alert';
import Modal from '../../components/modal';
import ProjectPreview from '../../components/project-preview';
import Spinner from '../../components/spinner';
import { GET_PROJECTS_BY_VIEWER } from '../../graphql/queries';
import sharedStyles from '../../shared.module.scss';
import { Suspend } from '../../utils/suspend';

const Projects: React.FC = () => {
  const [newProject, setNewProject] = useState(false);
  const { loading, error, data } = useQuery(GET_PROJECTS_BY_VIEWER);

  const projects = data && data.projectsByViewer || [];

  function closeModal() {
    setNewProject(false);
  }

  return (
    <div className={sharedStyles.wrapperLarge}>
      <div className={sharedStyles.heading}>
        <div className="row">
          <h1 className="col-xs-6">Projects</h1>

          <div className="col-xs-6 text-right m-t-10">
            <button
              onClick={() => setNewProject(true)}
              className="pt-button pt-intent-success"
              style={{ paddingLeft: 20, paddingRight: 20 }}
            >
              Create project
            </button>
            {newProject && (
              <Modal
                title="Create new project"
                close={closeModal}
              >
                <div>
                  <p>Hello world</p>
                </div>

                <footer>
                  <button className="pt-button m-r-10" onClick={closeModal}>Cancel</button>
                  <button className="pt-button pt-intent-success">Create Project</button>
                </footer>
              </Modal>
            )}
          </div>
        </div>
      </div>

      <Alert
        show={!!error}
        type="danger"
        title={error && error.message}
      />

      {/* @TODO: Create skeletons for loading projects */}
      <Suspense fallback={<Spinner type="full" />}>
        {loading && <Suspend />}

        <div className="row">
          {projects.map((project: any, index: number) => (
            <div key={`${project.id}-${index}`} className="col-xs-12 col-sm-6 col-md-4">
              <ProjectPreview
                id={project.id}
                image={project.image}
                name={project.name}
                owner={project.owner}
                description={project.description}
                contributors={project.contributors}
                comments={[]}
                views={project.views}
                isPrivate={project.isPrivate}
              />
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default Projects;
