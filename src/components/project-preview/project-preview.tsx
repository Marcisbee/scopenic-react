import cc from 'classcat';
import React from 'react';

import { ReactComponent as LockIcon } from '../../assets/svg/icons/lock.icon.svg';
import Avatar from '../avatar';

import styles from './projects-preview.module.scss';

interface IProjectPreviewProps {
  image: string;
  name: string;
  owner: {
    avatar: string,
    url: string,
  };
  description: string;
  contributors: any[];
  comments: any[];
  views: number | string;
  isPrivate?: boolean;
}

const ProjectPreview: React.FC<IProjectPreviewProps> = ({
  image,
  name,
  description,
  contributors,
  comments,
  views,
  isPrivate,
}) => {
  return (
    <div className={styles.project}>
      <div className={styles.header}>
        <img src={image} alt={name}/>
      </div>

      <div className={styles.content}>
        <h4>
          {isPrivate && <LockIcon />}
          {name}
        </h4>
        <p>{description}</p>

        <div
          className={cc([
            'row',
            styles.footer,
          ])}
        >
          <div
            className={cc([
              'col-xs-5',
              styles.contributors,
            ])}
          >
            {contributors.map((contributor) => (
              <Avatar key={contributor.name} text={contributor.name} size={26} />
            ))}
          </div>
          <div className="col-xs-7">
            other stuff
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPreview;
