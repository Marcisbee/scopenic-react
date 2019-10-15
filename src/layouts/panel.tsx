import React, { Suspense } from 'react';
import { NavLink, Link } from 'react-router-dom';

import LoadingMessage from '../components/loading-message';
import { useAuth } from '../context/auth';
import Avatar from '../components/avatar';
import ScopeShape from '../components/decorations/scope-shape';

import styles from './panel.module.scss';

const PanelLayout: React.FC = ({ children }) => {
  const { userData, logout } = useAuth();

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
              <i className="im im-home"></i>
            </NavLink>
          </li>
          <li>
            <NavLink exact={true} activeClassName={styles.menuActive} to="/settings">
              <ScopeShape />
              <i className="im im-gear"></i>
            </NavLink>
          </li>
        </ul>

        <ul className={styles.bottomMenu}>
          <li>
            <a>
              <ScopeShape />
              <i className="im im-bell"></i>
            </a>
          </li>
          <li>
            <a>
              <Avatar src={userData.email} />
            </a>

            <ul>
              <li><a>Help</a></li>
              <li><Link to="/settings">Edit profile</Link></li>
              <li><a onClick={logout}>Sign out</a></li>
            </ul>
          </li>
        </ul>
      </div>

      <div className={styles.main}>
        <div className={styles.wrapper}>
          <Suspense fallback={<LoadingMessage />}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default PanelLayout;
