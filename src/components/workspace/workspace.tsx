import React from 'react';
import Frame from 'react-frame-component';

// @TODO:
// 1. create node structure
// 2. build parser, generate html, css
// 3. add context of project to plugins and here
const Workspace = React.memo<any>(() => {
  return (
    <div>
      {/* https://github.com/ryanseddon/react-frame-component */}
      <Frame>
        <h1>Hello world</h1>
        {/* <pre>{JSON.stringify(JSON.parse(project.data), null, '  ')}</pre> */}
      </Frame>
    </div>
  );
}, () => false);

export default Workspace;
