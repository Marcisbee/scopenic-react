import React from 'react';

import ProjectPreview from '../../components/project-preview';
import sharedStyles from '../../shared.module.scss';

const Projects: React.FC = () => {
  return (
    <div className={sharedStyles.wrapperLarge}>
      <div className={sharedStyles.heading}>
        <h1>Projects</h1>
      </div>

      <div className="row">
        <div className="col-xs-4">
          <ProjectPreview
            image="https://cdn.dribbble.com/users/180062/screenshots/7442135/shot-cropped-1570784692945.png"
            name="My blog"
            owner={{
              avatar: '',
              url: '',
            }}
            description="Contrary to popular belief, Lorem Ipsum is not simply random text."
            contributors={[
              {
                avatar: '',
                name: 'Arthur Krapan',
              },
              {
                avatar: '',
                name: 'Marcis Bergmanis',
              },
            ]}
            comments={[]}
            views="10"
            isPrivate={true}
          />
        </div>
        <div className="col-xs-4">
          <ProjectPreview
            image="https://cdn.dribbble.com/users/180062/screenshots/7442135/shot-cropped-1570784692945.png"
            name="Strike.lv blogs"
            owner={{
              avatar: '',
              url: '',
            }}
            description="Contrary to popular belief, Lorem Ipsum is not simply random text."
            contributors={[
              {
                avatar: '',
                name: 'John Doe',
              },
            ]}
            comments={[]}
            views="230103"
            isPrivate={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
