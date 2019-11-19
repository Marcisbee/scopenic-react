import React from 'react';

import styles from './project-icon.module.scss';

interface IProjectIconProps {
  src?: string;
  size?: number;
}

const ProjectIcon: React.FC<IProjectIconProps> = ({ src, size }) => {
  if (src) {
    return (
      <div
        className={styles.avatar}
        style={{
          height: size,
          width: size,
        }}
      >
        <img src={src} alt="Project icon" />
      </div>
    );
  }

  return (
    <div
      className={styles.avatar}
      style={{
        height: size,
        width: size,
      }}
    >
      <div className={styles.none}>
        <i
          className="im im-files-o"
          style={{
            lineHeight: `${(size || 10) + 2}px`,
            fontSize: size ? size / 2 : '20px',
          }}
        />
      </div>
    </div>
  );
};

export default ProjectIcon;
