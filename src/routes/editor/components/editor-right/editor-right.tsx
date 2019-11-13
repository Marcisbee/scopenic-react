import dlv from 'dlv';
import React, { useEffect, useState } from 'react';

import { EditorStore } from '../../context/editor-context';

const EditorRight: React.FC = () => {
  const { state, workspaceRef } = EditorStore.useStoreState((s) => s);
  const { updateElement, updateStyle } = EditorStore.useStoreActions((s) => s);
  const [cssDeclarations, setCssDeclarations] = useState<CSSStyleDeclaration>();

  const element = dlv(state.data.pages[state.activePage], 'children.' + state.activeElement.path.slice(1).join('.children.'));
  const currentClassName = (element && element.className) || state.activeElement.id;

  useEffect(() => {
    if (!workspaceRef || !workspaceRef.current) {
      setCssDeclarations(undefined);
      return;
    }

    const node: HTMLIFrameElement = (workspaceRef.current as any).node;

    if (state.activeElement.id && node && node.contentDocument) {
      const el = node.contentDocument.querySelector(`.${currentClassName}`);

      if (el) {
        setCssDeclarations(window.getComputedStyle(el));
        return;
      }
    }

    setCssDeclarations(undefined);
  }, [state, 'pages', state.activeElement.id && dlv(state.data.css, state.activeElement.id), workspaceRef && workspaceRef.current]);

  const defaultStyles = cssDeclarations && {
    backgroundColor: cssDeclarations.backgroundColor,
    color: cssDeclarations.color,
  };

  return (
    <div>
      Selected element: {JSON.stringify(state.activeElement)}
      <br />
      ClassName: {currentClassName || <i>NONE</i>}
      <h2>Element:</h2>
      <pre
        style={{ fontSize: 12 }}
        contentEditable={true}
        onBlur={(e) => {
          const value = JSON.parse(e.target.innerText);

          updateElement({ path: state.activeElement.path.slice(1), element: value });
        }}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            element,
            // Don't care about children data here
            (key, value) => key === 'children' ? undefined : value,
            ' ',
          ),
        }}
      />
      <h2>Styles:</h2>
      {state.activeElement.id && (
        <pre
          style={{ fontSize: 12 }}
          contentEditable={true}
          onBlur={(e) => {
            const key = state.activeElement.id;
            const className = element.className;
            const value = JSON.parse(e.target.innerText);

            updateStyle({ id: key, className, style: value });
          }}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              dlv(state.data.css, currentClassName),
              null,
              ' ',
            ),
          }}
        />
      )}
      <h3>Default styles:</h3>
      <pre style={{ fontSize: 12, overflow: 'hidden' }}>{JSON.stringify(defaultStyles, null, ' ')}</pre>
    </div>
  );
};

export default EditorRight;
