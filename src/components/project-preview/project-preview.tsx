import cc from 'classcat';
import React from 'react';
import { Link } from 'react-router-dom';

import { CommentsIcon, FlagIcon, LockIcon } from '../../components/icons';
import Avatar from '../avatar';

import styles from './projects-preview.module.scss';

interface IProjectPreviewProps {
  id: string;
  image: string;
  name: string;
  owner: {
    id: string,
    avatar: string,
    name: string,
  };
  description: string;
  contributors: any[];
  comments: any[];
  views: number | string;
  isPrivate?: boolean;
}

const ProjectPreview: React.FC<IProjectPreviewProps> = ({
  id,
  image,
  name,
  description,
  contributors,
  owner,
  comments,
  views,
  isPrivate,
}) => {
  return (
    <Link to={`/editor/${id}`} className={styles.project}>
      <span className={styles.header}>
        <img src={image} alt={name}/>
      </span>

      <span className={styles.content}>
        <strong className={styles.title}>
          {isPrivate && <LockIcon />}
          {name}
        </strong>

        <span className={styles.paragraph}>
          {description || (
            <i style={{ opacity: 0.5 }}>No description</i>
          )}
        </span>

        <span
          className={cc([
            'row',
            styles.footer,
          ])}
        >
          <span
            className={cc([
              'col-xs-5',
              styles.contributors,
            ])}
          >
            {/* <Avatar src={owner.avatar} text={owner.name} size={26} /> */}
            {contributors.filter((c) => !!c).map((contributor, index) => (
              <Avatar key={`${contributor.id}-${index}-${name}`} src={contributor.avatar} text={`${contributor.first_name} ${contributor.last_name}`} size={26} />
            ))}
          </span>
          <span className="col-xs-7 text-right">
            <span className={styles.metaItem}>
              <FlagIcon />
              {comments.filter((c) => c && !c.resolved).length}
            </span>

            <span className={styles.metaItem}>
              <CommentsIcon />
              {comments.filter((c) => c && c.resolved).length}
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
};

export default ProjectPreview;
