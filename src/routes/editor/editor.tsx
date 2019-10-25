import React from 'react';

import styles from './editor.module.scss';

const Editor: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>LEFT</div>
      <div className={styles.right}>RIGHT</div>
      <div>MIDDLE</div>
    </div>
  );
};

export default Editor;
