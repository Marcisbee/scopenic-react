import React from 'react';
import { Link } from 'react-router-dom';

// import Header from '../components/header';

import styles from './panel.module.scss';

const PanelLayout: React.FC = ({ children }) => {
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

        <ul>
          <li>
            Notifications
          </li>
          <li>
            User
          </li>
        </ul>
      </div>
      <div className={styles.main}>
        <div className={styles.wrapper}>
          {/* <Header /> */}
          {children}
        </div>
      </div>
    </div>
  )
}

export default PanelLayout;
