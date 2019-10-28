import { useQuery } from '@apollo/react-hooks';
import cc from 'classcat';
import React, { Suspense } from 'react';

import Alert from '../../components/alert/alert';
import CreateNewProject from '../../components/create-new-project';
import ProjectPreview from '../../components/project-preview';
import Spinner from '../../components/spinner';
import { GET_PROJECTS_BY_VIEWER } from '../../graphql/queries';
import sharedStyles from '../../shared.module.scss';
import { Suspend } from '../../utils/suspend';

const Projects: React.FC = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS_BY_VIEWER, {
    fetchPolicy: 'cache-and-network',
  });

  const projects = data && data.projectsByViewer || [];

  return (
    <div className={cc([sharedStyles.wrapperLarge, 'p-t-20', 'p-b-20'])}>
      <div className={sharedStyles.heading}>
        <div className="row">
          <h1 className="col-xs-6">Projects</h1>

          <div className="col-xs-6 text-right m-t-10">
            <CreateNewProject />
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
