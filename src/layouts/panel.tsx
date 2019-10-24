import React, { Suspense } from 'react';
import { Link, NavLink } from 'react-router-dom';

import Avatar from '../components/avatar';
import ScopeShape from '../components/decorations/scope-shape';
import {
  HomeIcon,
  MoonIcon,
  NotificationIcon,
  SettingIcon,
  SunIcon,
} from '../components/icons';
import Plugins from '../components/plugins';
import Spinner from '../components/spinner';
import { useAuth } from '../hooks/use-auth';
import { useDarkMode } from '../hooks/use-dark-mode';

import styles from './panel.module.scss';

// Plugins
const enabledPlugins = {
  // 'hello-world': () => import('../plugins/panel/hello-world'),
};

const PanelLayout: React.FC = React.memo(({ children }) => {
  const { user, signout } = useAuth();
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <div className={styles.panel}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <img src={require('../assets/images/logo.png')} alt="Scopenic"/>
        </div>

        <ul className={styles.menu}>
          <li>
            <NavLink exact={true} activeClassName={styles.menuActive} to="/projects">
              <ScopeShape className={styles.menuIconBg} />
              <HomeIcon className={styles.menuIcon} />
            </NavLink>
          </li>
          <li>
            <NavLink exact={true} activeClassName={styles.menuActive} to="/settings">
              <ScopeShape className={styles.menuIconBg} />
              <SettingIcon className={styles.menuIcon} />
            </NavLink>
          </li>
          <Plugins
            scope="panelMenu"
            src={enabledPlugins}
            render={({ children: child }) => (
              <li>
                {child}
              </li>
            )}
          />
        </ul>

        <ul className={styles.bottomMenu}>
          <li>
            <a onClick={() => { setDarkMode(!darkMode); }}>
              <ScopeShape className={styles.menuIconBg} />
              {darkMode
                ? <SunIcon className={styles.menuIcon} />
                : <MoonIcon className={styles.menuIcon} />
              }
            </a>
          </li>
          <li>
            <a>
              <ScopeShape className={styles.menuIconBg} />
              <NotificationIcon className={styles.menuIcon} />
            </a>
          </li>
          <li>
            <a>
              <Avatar src={user.avatar} text={`${user.first_name} ${user.last_name}`} />
            </a>

            <ul>
              <li><a>Help</a></li>
              <li><Link to="/settings">Edit profile</Link></li>
              <li className={styles.divider}/>
              <li><a onClick={signout}>Sign out</a></li>
            </ul>
          </li>
        </ul>
      </div>

      <div className={styles.main}>
        <Suspense fallback={<Spinner type="full" />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}, () => false);

export default PanelLayout;
