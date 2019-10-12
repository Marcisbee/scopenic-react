import React from 'react';

import Header from '../components/header';

import styles from './panel.module.css';

const PanelLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.panel}>
      <Header />
      {children}
    </div>
  )
}

export default PanelLayout;
