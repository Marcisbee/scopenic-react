import React from 'react';

import SettingsBlock from '../../components/settings-block';
import styles from '../../shared.module.scss';

const Settings: React.FC = () => {
  return (
    <div>
      <div className={styles.heading}>
        <h1>Settings</h1>
      </div>

      <SettingsBlock header="Profile details">
        Hello world
      </SettingsBlock>

      <p>Lalala</p>
    </div>
  );
}

export default Settings;
