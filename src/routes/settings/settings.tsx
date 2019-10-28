import cc from 'classcat';
import React from 'react';

import { PersonIcon, ShieldCheckIcon } from '../../components/icons';
import SettingsBlock from '../../components/settings-block';
import SettingsProfile from '../../components/settings-profile';
import SettingsSecurity from '../../components/settings-security';
import sharedStyles from '../../shared.module.scss';

const Settings: React.FC = () => {
  return (
    <div className={cc([sharedStyles.wrapper, 'p-b-20', 'p-t-20'])}>
      <div className={sharedStyles.heading}>
        <h1>Settings</h1>
      </div>

      <SettingsBlock
        icon={
          <PersonIcon className="sc-settings-icon-fg" />
        }
        color="#0a8ffb"
        title="Profile details"
        description="General profile information"
        open={true}
      >
        <SettingsProfile />
      </SettingsBlock>

      <SettingsBlock
        icon={
          <ShieldCheckIcon className="sc-settings-icon-fg" />
        }
        color="#d62828"
        title="Security settings"
        description="Change current password, enable two-factor authentification"
      >
        <SettingsSecurity />
      </SettingsBlock>
    </div>
  );
};

export default Settings;
