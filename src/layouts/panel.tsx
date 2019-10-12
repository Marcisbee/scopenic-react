import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';

import Logout from '../components/logout';
import LoadingMessage from '../components/loading-message';
import { useAuth } from '../context/auth';

import styles from './panel.module.scss';

const PanelLayout: React.FC = ({ children }) => {
  const { userData } = useAuth();

  console.log({ userData });

  return (
    <div className={styles.panel}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <img src={require('../assets/images/logo.png')} alt="Scopenic"/>
        </div>

        <ul className={styles.menu}>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>

        <ul className={styles.bottomMenu}>
          <li>
            Notifications
          </li>
          <li>
            User
            <Logout className="pure-button">Log out</Logout>
          </li>
        </ul>
      </div>
      <div className={styles.main}>
        <div className={styles.wrapper}>
          {/* <Header /> */}
          <Suspense fallback={<LoadingMessage />}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default PanelLayout;
