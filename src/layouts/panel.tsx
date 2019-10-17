import React, { Suspense } from 'react';
import { Link, NavLink } from 'react-router-dom';

import Avatar from '../components/avatar';
import ScopeShape from '../components/decorations/scope-shape';
import Spinner from '../components/spinner';
import { useAuth } from '../hooks/use-auth';
import { useDarkMode } from '../hooks/use-dark-mode';

import styles from './panel.module.scss';

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
              <ScopeShape />
              <i className="im im-home"/>
            </NavLink>
          </li>
          <li>
            <NavLink exact={true} activeClassName={styles.menuActive} to="/settings">
              <ScopeShape />
              <i className="im im-gear"/>
            </NavLink>
          </li>
        </ul>

        <ul className={styles.bottomMenu}>
          {/* @TODO: Enable dark mode option */}
          <li>
            <a onClick={() => { setDarkMode(!darkMode); }}>
              <ScopeShape />
              <i className="im im-paintbrush"/>
            </a>
          </li>
          <li>
            <a>
              <ScopeShape />
              <i className="im im-bell"/>
            </a>
          </li>
          <li>
            <a>
              <Avatar src={user.email} />
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
        <div className={styles.wrapper}>
          <Suspense fallback={<Spinner type="full" />}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
}, () => false);

export default PanelLayout;
