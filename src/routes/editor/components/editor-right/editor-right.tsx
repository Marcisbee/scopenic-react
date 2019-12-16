import dlv from 'dlv';
import React, { useMemo } from 'react';

import KnobsBlock from '../../../../components/knobs-block';
import { useRefsContext } from '../../../../utils/refs-context';
import { EditorStore } from '../../context/editor-context';
import NumberInput from '../knob-number-input/knob-number-input';

const EditorRight: React.FC = () => {
  const refs = useRefsContext();
  const { state, isWorkspacePageActive } = EditorStore.useStoreState((s) => s);
  const { updateElement, updateStyle, updateStylePropery } = EditorStore.useStoreActions((s) => s);

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

  const currentStyles = state.data.css[currentClassName] || {};

  const defaultStyles = {
    backgroundColor: cssDeclarations && cssDeclarations.backgroundColor,
    color: cssDeclarations && cssDeclarations.color,
    fontSize: cssDeclarations && cssDeclarations.fontSize,
    lineHeight: cssDeclarations && cssDeclarations.lineHeight,
  };

  if (!currentClassName) {
    return null;
  }

  return (
    <div>
      <br />
      <br />
      <KnobsBlock
        title="Text format"
      >
        <NumberInput
          label="Font Size"
          min={1}
          value={currentStyles.fontSize || defaultStyles.fontSize}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'fontSize',
              value,
            });
          }}
        />
        <NumberInput
          label="Line Height"
          min={1}
          value={currentStyles.lineHeight || defaultStyles.lineHeight}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'lineHeight',
              value,
            });
          }}
        />
      </KnobsBlock>

      <KnobsBlock
        title="Appearance"
      >
        asd
      </KnobsBlock>

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
