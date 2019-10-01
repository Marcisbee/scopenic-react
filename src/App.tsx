import { hot } from 'react-hot-loader/root';
import React from 'react';
import Store from 'statux';
import Counter from './Counter';
// import logo from './logo.svg';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <Store user={null} books={[]}>
      <div className={styles.app}>
        <header className={styles.header}>
          <Counter />
        </header>
      </div>
    </Store>
  );
}

export default hot(App);
