import React, { useContext } from 'react';
import Frame from 'react-frame-component';

import { projectContext } from '../../routes/editor/editor';
import { renderChild } from '../render/render';

import styles from './workspace.module.scss';

// @TODO:
// [x] 1. create node structure
// [ ] 2. build parser, generate html, css
// [x] 3. add context of project to plugins and here
const Workspace = React.memo<any>(() => {
  const { state } = useContext(projectContext);

  return (
    <div>
      <div className={styles.container}>
        {/* https://github.com/ryanseddon/react-frame-component */}
        <Frame>
          <h1>Hello world</h1>
          <div>
            {state.data[state.activePage].children.map(renderChild)}
          </div>
          <pre>{JSON.stringify(state.data[state.activePage], null, '  ')}</pre>
        </Frame>
      </div>
    </div>
  );
}, () => false);

export default Workspace;
