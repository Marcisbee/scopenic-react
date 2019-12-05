import dlv from 'dlv';
import React, { useMemo } from 'react';

import { useRefsContext } from '../../../../utils/refs-context';
import { EditorStore } from '../../context/editor-context';

const EditorRight: React.FC = () => {
  const refs = useRefsContext();
  const { state, isWorkspacePageActive } = EditorStore.useStoreState((s) => s);
  const { updateElement, updateStyle } = EditorStore.useStoreActions((s) => s);

  const element = typeof isWorkspacePageActive === 'string'
    && dlv(state.data.pages[isWorkspacePageActive], 'children.' + state.activeElement.path.slice(1).join('.children.'));
  const currentClassName = (element && element.className) || state.activeElement.id;

  const cssDeclarations = useMemo(() => {
    if (!refs.workspace || !refs.workspace.current) {
      return undefined;
    }

    const node: HTMLIFrameElement = (refs.workspace.current as any).node;

    if (state.activeElement.id && node && node.contentDocument) {
      const el = node.contentDocument.querySelector(`.${currentClassName}`);

      if (el) {
        return window.getComputedStyle(el);
      }
    }
  }, [state.activeElement.id, state.activeElement.path]);

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
          try {
            const value = JSON.parse(e.target.innerText);

            updateElement({ path: state.activeElement.path.slice(1), element: value });
          } catch (e) {
            console.error(e);
          }
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

            try {
              const value = JSON.parse(e.target.innerText);

              updateStyle({ id: key, className, style: value });
            } catch (e) {
              console.error(e);
            }
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
