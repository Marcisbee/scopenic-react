import dlv from 'dlv';
import React, { useEffect, useState } from 'react';

import { useEditorDispatch, useEditorState } from '../../context/editor-context';

const EditorRight: React.FC = () => {
  const { state, workspaceRef } = useEditorState();
  const { updateElement, updateStyle } = useEditorDispatch();
  const [cssDeclarations, setCssDeclarations] = useState<CSSStyleDeclaration>();

  useEffect(() => {
    if (!workspaceRef || !workspaceRef.current) {
      setCssDeclarations(undefined);
      return;
    }

    const node: HTMLIFrameElement = (workspaceRef.current as any).node;

    if (state.activeElement.id && node && node.contentDocument) {
      const el = node.contentDocument.querySelector(`.${state.activeElement.id}`);

      if (el) {
        setCssDeclarations(window.getComputedStyle(el));
        return;
      }
    }

    setCssDeclarations(undefined);
  }, [state, 'pages', state.activeElement.id && dlv(state.data.css, state.activeElement.id), workspaceRef.current]);

  const defaultStyles = cssDeclarations && {
    backgroundColor: cssDeclarations.backgroundColor,
    color: cssDeclarations.color,
  };

  const element = dlv(state.data.pages[state.activePage], 'children.' + state.activeElement.path.slice(1).join('.children.'));

  return (
    <div>
      Selected element: {JSON.stringify(state.activeElement)}
      <h2>Element:</h2>
      <pre
        style={{ fontSize: 12 }}
        contentEditable={true}
        onBlur={(e) => {
          const value = JSON.parse(e.target.innerText);

          updateElement(state.activeElement.path.slice(1), value);
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
            const value = JSON.parse(e.target.innerText);

            updateStyle(key, value);
          }}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              dlv(state.data.css, state.activeElement.id),
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
