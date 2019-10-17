import React from 'react';

import SettingsBlock from '../../components/settings-block';
import styles from '../../shared.module.scss';

const Settings: React.FC = () => {
  return (
    <div>
      <div className={styles.heading}>
        <h1>Settings</h1>
      </div>

      <SettingsBlock
        icon="id-card"
        color="#0a8ffb"
        title="Profile details"
        description="Lorem ipsum"
      >
        Hello world
        <div className="row">
          <div className="one column">
            <div className="pt-form-group">
              <label className="pt-label" htmlFor="example-form-group-input-a">
                Label A
                <span className="pt-text-muted">(required)</span>
              </label>
      </SettingsBlock>

      <p>Lalala</p>
    </div>
  );
};

export default Settings;
