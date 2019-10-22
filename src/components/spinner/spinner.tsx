import cc from 'classcat';
import React from 'react';

import styles from './spinner.module.scss';

interface ISpinnerProps {
  type?: 'inline' | 'full';
  theme?: 'light' | 'dark';
  size?: number;
}

const Spinner = React.memo<ISpinnerProps>(({ type = 'inline', theme = 'dark', size = 50 }) => {
  return (
    <div className={cc([type === 'full' && styles.full])}>
      <svg
        className={cc([styles.spinner, styles[theme]])}
        viewBox="0 0 50 50"
        style={{
          height: `${size}px`,
          marginLeft: `${-(size / 2)}px`,
          marginTop: `${-(size / 2)}px`,
          width: `${size}px`,
        }}
      >
        <circle
          className={styles.path}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
    </div>
  );
}, () => false);

export default Spinner;
