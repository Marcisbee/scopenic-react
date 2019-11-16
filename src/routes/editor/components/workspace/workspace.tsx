import React, { CSSProperties } from 'react';
import Frame from 'react-frame-component';

import { renderChild } from '../../../../components/render/render';
import { useRefsContext } from '../../../../utils/refs-context';
import { EditorStore } from '../../context/editor-context';

import Overlay from './components/overlay/overlay';
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

const Workspace = React.memo<any>(() => {
  const refs = useRefsContext();
  const { state } = EditorStore.useStoreState((s) => s);

  const css = buildCss(state.data.css);

  return (
    <div>
      <div className={styles.container}>
        {/* https://github.com/ryanseddon/react-frame-component */}
        <Frame ref={refs.workspace}>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          />

          <style>{css}</style>

          <div>
            {state.data.pages[state.activePage].children.map((props: any, n: number) => renderChild(props, [String(n)]))}
          </div>

          <Overlay />
        </Frame>
      </div>
    </div>
  );
}, () => false);

export default Workspace;
