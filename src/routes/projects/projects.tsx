import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import ProjectPreview from '../../components/project-preview';
import { GET_PROJECTS_BY_VIEWER } from '../../graphql/queries';
import sharedStyles from '../../shared.module.scss';

const Projects: React.FC = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS_BY_VIEWER);

  const projects = data && data.projectsByViewer || [];

  if (loading) {
    return <p>Loading..</p>;
  }

  return (
    <div className={sharedStyles.wrapperLarge}>
      <div className={sharedStyles.heading}>
        <div className="row">
          <h1 className="col-xs-6">Projects</h1>

          <div className="col-xs-6 text-right m-t-10">
            <button className="pt-button pt-intent-success" style={{ paddingLeft: 20, paddingRight: 20 }}>
              Create project
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Projects;
