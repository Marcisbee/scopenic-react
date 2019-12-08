import cc from 'classcat';
import React, { useState } from 'react';

import styles from './knobs-block.module.scss';

interface IKnobsBlockProps {
  title: string;
  open?: boolean;
}

const KnobsBlock: React.FC<IKnobsBlockProps> = ({ title, open = true, children }) => {
  const [isOpen, setOpen] = useState(open);

  function onClick() {
    setOpen((state) => !state);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={onClick}>
        <div>
          <strong>{title}</strong>
        </div>

        <i
          className={cc([
            styles.toggle,
            'im',
            {
              'im-angle-down': !isOpen,
              'im-angle-up': isOpen,
            },
          ])}
        />
      </div>

      {isOpen && (
        <div className={styles.main}>
          {children}
        </div>
      )}
    </div>
  );
};

export default KnobsBlock;
