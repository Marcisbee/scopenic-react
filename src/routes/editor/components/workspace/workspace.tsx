import cc from 'classcat';
import React, { CSSProperties, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import Frame from 'react-frame-component';

import DragPortal from '../../../../components/drag-portal/drag-portal';
import { renderChild } from '../../../../components/render/render';
import { useMousePosition } from '../../../../hooks/use-mouse-position';
import { useRefsContext } from '../../../../utils/refs-context';
import { EditorStore } from '../../context/editor-context';

import Overlay from './components/overlay/overlay';
import Tabs from './components/tabs/tabs';
import { useOverlayContext } from './context/overlay';
import styles from './workspace.module.scss';

const UPPERCASE_LETTER = /[A-Z]/g;

function toKebabCase(value: string): string {
  return `-${value.toLowerCase()}`;
}

function buildStyle(acc: string, [key, value]: [string, string]): string {
  return acc.concat(`${key.replace(UPPERCASE_LETTER, toKebabCase)}: ${value};`);
}

function buildSelectors(acc: string, [key, value]: [string, CSSProperties]): string {
  const prefixSelectors: any = {};
  const style = Object.entries(value)
    .reduce((all, entry) => {
      if (entry[0][0] === ':' || entry[0][0] === '@') {
        const name = `${key}${entry[0]}`;
        prefixSelectors[name] = entry[1];

        return all;
      }

      return buildStyle(all, entry);
    }, '');

  const newKey = key.slice(0, 3) === 'sc-'
    ? `.${key}`
    : `${key}`;

  return acc
    .concat(`${newKey} {${style}}`)
    .concat(
      buildCss(prefixSelectors)
    );
}

function buildCss(css: Record<string, CSSProperties>): string {
  return Object.entries(css).reduce(buildSelectors, '');
}

function useWorkspaceSize({ reverse, mousePosition, type, setState }: { reverse?: boolean, mousePosition: any, type: 'x' | 'y', setState: React.Dispatch<React.SetStateAction<number>> } = {} as any) {
  const [down, setDown] = React.useState(false);
  const { diff } = mousePosition;

  const modifier = reverse ? -1 : 1;

  const onMouseDown = useCallback(() => {
    setDown(true);
  }, []);

  const onMouseUp = useCallback(() => {
    setDown(false);
  }, []);

  React.useEffect(() => {
    if (down) {
      const newValue = diff[type] * modifier;

      setState((s: number) => Math.max(0, s + newValue));
    }
  }, [diff[type]]);

  return {
    onMouseDown,
    onMouseUp,
  };
}

const ResizeHandlers: React.FC<{
  setWidth: React.Dispatch<React.SetStateAction<number>>,
  setHeight: React.Dispatch<React.SetStateAction<number>>,
}> = ({ setWidth, setHeight }) => {
  const mousePosition = useMousePosition();
  const handlersWidth = useWorkspaceSize({ reverse: false, mousePosition, type: 'x', setState: setWidth });
  const handlersWidthReverse = useWorkspaceSize({ reverse: true, mousePosition, type: 'x', setState: setWidth });

  return (
    <>
      <div {...handlersWidthReverse} className={styles.handleLeft}><DragPortal /></div>
      <div {...handlersWidth} className={styles.handleRight}><DragPortal /></div>

    </>
  );
};

const Workspace = React.memo<any>(() => {
  const refs = useRefsContext();
  const cssRef = useRef<HTMLStyleElement>();
  const stateCss = EditorStore.useStoreState((s) => s.state.data.css);
  const pages = EditorStore.useStoreState((s) => s.state.data.pages);
  const isWorkspacePageActive = EditorStore.useStoreState((s) => s.isWorkspacePageActive);
  const [overlayContext] = useOverlayContext();
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(900);
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);

  const type = useMemo(() => {
    if (width <= 500 / 2) {
      return 'mobile';
    }

    if (width <= 768 / 2) {
      return 'tablet';
    }

    return 'desktop';
  }, [width]);

  const htmlNodes = useMemo(() => {
    return typeof isWorkspacePageActive === 'string' && (
      <div onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
        {pages[isWorkspacePageActive].children.map(
          (props: any, n: number) => renderChild(props, [String(n)]),
        )}
      </div>
    );
  }, [isWorkspacePageActive, pages[isWorkspacePageActive as any] && JSON.stringify(pages[isWorkspacePageActive as any].children)]);

  const css = buildCss(stateCss);
  useEffect(() => {
    if (cssRef.current) {
      cssRef.current.innerHTML = buildCss(stateCss);
    }
  }, [isFrameLoaded, css]);

  const handleFrameLoaded = useCallback(() => {
    // Avoid react warning about this being bad practice
    setTimeout(() => {
      setIsFrameLoaded(true);
    }, 0);
  }, []);

  return (
    <div>
      {isWorkspacePageActive ? (
        <>
          <div className={styles.tabs}>
            <Tabs />
          </div>

          <div className={styles.controls}>
            <button
              onClick={() => setWidth(2000)}
              className={cc({ active: type === 'desktop' })}
              style={{
                width: '100%',
              }}
            >
              Desktop
            </button>
            <button
              onClick={() => setWidth(768 / 2)}
              className={cc({ active: type === 'tablet' })}
              style={{
                width: 768,
              }}
            >
              Tablet - 768px
            </button>
            <button
              onClick={() => setWidth(500 / 2)}
              className={cc({ active: type === 'mobile' })}
              style={{
                width: 500,
              }}
            >
              Mobile - 500px
            </button>
          </div>

          <div
            className={styles.container}
            style={{
              height: Math.max(height, 300),
              width: Math.max(width * 2, 300),
            }}
          >
            {/* https://github.com/ryanseddon/react-frame-component */}
            <Frame ref={refs.workspace} onLoad={handleFrameLoaded}>
              <link
                rel="stylesheet"
                href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
              />

              <style>
                {`
                  body {
                    overflow-x: hidden;
                    overflow-y: scroll;
                  }
                `}
              </style>
              <style ref={cssRef as any} />

              {htmlNodes}

              {/* {overlayContext.element && <Overlay />} */}
            </Frame>

            {/* <ResizeHandlers setWidth={setWidth} setHeight={setHeight} /> */}
          </div>
        </>
      ) : (
          <div className={styles.noTab}>
            <h4>Scopenic Editor</h4>
            <p>Visual web developer tool</p>

            <hr />

            <div className={styles.noTabBlock}>
              <strong>Start</strong>
              <ul>
                <li>New page</li>
                <li>New component</li>
              </ul>
            </div>

            <div className={styles.noTabBlock}>
              <strong>Help</strong>
              <ul>
                <li>New page</li>
                <li>New component</li>
              </ul>
            </div>
          </div>
        )}
    </div>
  );
}, () => false);

export default Workspace;
