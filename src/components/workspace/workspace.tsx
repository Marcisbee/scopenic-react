import React, { useContext } from 'react';
import Frame from 'react-frame-component';

import { projectContext } from '../../routes/editor/editor';

// @TODO:
// 1. create node structure
// 2. build parser, generate html, css
// 3. add context of project to plugins and here
const Workspace = React.memo<any>(() => {
  const { state } = useContext(projectContext);

  return (
    <div>
      {/* https://github.com/ryanseddon/react-frame-component */}
      <Frame>
        <h1>Hello world</h1>
        <pre>{JSON.stringify(state.data[state.activePage], null, '  ')}</pre>
      </Frame>
    </div>
  );
}, () => false);

export default Workspace;
