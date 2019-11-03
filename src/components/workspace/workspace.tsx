import React, { CSSProperties, useContext } from 'react';
import Frame from 'react-frame-component';

import { projectContext } from '../../routes/editor/editor';
import { renderChild } from '../render/render';

import styles from './workspace.module.scss';

const UPPERCASE_LETTER = /[A-Z]/g;

function toKebabCase(value: string): string {
  return `-${value.toLowerCase()}`;
}

function buildStyle(acc: string, [key, value]: [string, string]): string {
  return acc.concat(`${key.replace(UPPERCASE_LETTER, toKebabCase)}: ${value};`);
}

function buildSelectors(acc: string, [key, value]: [string, CSSProperties]): string {
  const style = Object.entries(value).reduce(buildStyle, '');

  return acc.concat(`.${key} {${style}}`);
}

function buildCss(css: Record<string, CSSProperties>): string {
  return Object.entries(css).reduce(buildSelectors, '');
}

// @TODO:
// [x] 1. create node structure
// [ ] 2. build parser, generate html, css
// [x] 3. add context of project to plugins and here
const Workspace = React.memo<any>(() => {
  const { state } = useContext(projectContext);

  const css = buildCss(state.css);

  return (
    <div>
      <div className={styles.container}>
        {/* https://github.com/ryanseddon/react-frame-component */}
        <Frame>
          <style>{css}</style>
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
