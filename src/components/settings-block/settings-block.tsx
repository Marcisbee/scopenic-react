import cc from 'classcat';
import React, { useState } from 'react';

import ScopeShape from '../decorations/scope-shape';

import styles from './settings-block.module.scss';

export interface ISettingsBlock {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  open?: boolean;
}

const SettingsBlock: React.FC<ISettingsBlock> = ({
  icon,
  color,
  title,
  description,
  children,
  open = false,
}) => {
  const [isOpen, setOpen] = useState(open);

  function onClick() {
    setOpen((state) => !state);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={onClick}>
        <div className={styles.icon}>
          <ScopeShape className={styles.iconBg} color={color} />
          {icon}
        </div>

        <div className={styles.description}>
          <strong>{title}</strong>
          <p>{description}</p>
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

export default SettingsBlock;
