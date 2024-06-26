import cc from 'classcat';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../components/avatar';
import ScopeShape from '../components/decorations/scope-shape';
import {
  HomeIcon,
  MoonIcon,
  NotificationIcon,
  SettingIcon,
  SunIcon,
} from '../components/icons';
import CustomLink from '../components/link';
import Plugins from '../components/plugins';
import Spinner from '../components/spinner';
import { UiStore } from '../context/ui-context';
import { useAuth } from '../hooks/use-auth';
import { useDarkMode } from '../hooks/use-dark-mode';

import styles from './panel.module.scss';

// Plugins
const enabledPlugins = {
  // 'hello-world': () => import('../plugins/panel/hello-world'),
  'layers': () => import('../plugins/editor/layers'),
  'dataset': () => import('../plugins/editor/dataset'),
  'commitHistory': () => import('../plugins/editor/commit-history'),
};

const PanelLayout: React.FC<{ type: 'dashboard' | 'editor' }> = React.memo(({
  type,
  children,
}) => {
  const panelLeftActive = UiStore.useStoreState((s) => s.panel.left.active);
  const setPanelLeftActive = UiStore.useStoreActions((s) => s.setPanelLeftActive);
  const { user, signout } = useAuth();
  const [darkMode, setDarkMode] = useDarkMode();

  const renderPlugins: React.FC<{ config: Record<string, any> }> = React.memo(({
    config: pluginConfig,
    children: child,
  }) => {
    return (
      <li>
        <span
          className={cc([
            panelLeftActive === pluginConfig.action && styles.menuActive,
          ])}
          onClick={() => setPanelLeftActive(pluginConfig.action)}
        >
          <ScopeShape className={styles.menuIconBg} />
          {child}
        </span>
      </li>
    );
  });

  return (
    <div className={styles.panel} style={{ minWidth: type === 'editor' ? 1100 : '100%' }}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Link to="/projects">
            <img src={'/resources/' + require('../assets/images/logo.png')} alt="Scopenic" />
          </Link>
        </div>

        {type === 'dashboard' && (
          <ul className={styles.menu}>
            <li>
              <CustomLink exact={true} activeClassName={styles.menuActive} to="/projects">
                <ScopeShape className={styles.menuIconBg} />
                <HomeIcon className={styles.menuIcon} />
              </CustomLink>
            </li>
            <li>
              <CustomLink exact={true} activeClassName={styles.menuActive} to="/settings">
                <ScopeShape className={styles.menuIconBg} />
                <SettingIcon className={styles.menuIcon} />
              </CustomLink>
            </li>
            <Plugins
              scope="dashboard.panel.menu"
              src={enabledPlugins}
              render={({ children: child }) => (
                <li>
                  {child}
                </li>
              )}
            />
          </ul>
        )}

        {type === 'editor' && (
          <ul className={styles.menu}>
            <Plugins
              scope="editor.panel.menu"
              src={enabledPlugins}
              render={renderPlugins}
            />
          </ul>
        )}

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
              <li className={styles.divider} />
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
