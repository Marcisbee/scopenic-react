import React from 'react';

import styles from './settings-block.module.scss';

const SettingsBlock: React.FC<{ header: string }> = ({ header, children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {header}
      </div>
      <div className={styles.main}>
        {children}
      </div>
    </div>
  );
}

export default SettingsBlock;
