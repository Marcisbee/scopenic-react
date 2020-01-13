import dlv from 'dlv';
import React, { useMemo } from 'react';

import KnobsBlock from '../../../../components/knobs-block';
import { useRefsContext } from '../../../../utils/refs-context';
import { EditorStore } from '../../context/editor-context';
import KnobButtonGroup from '../knob-button-group/knob-button-group';
import KnobColorInput from '../knob-color-input/knob-color-input';
import KnobImageInput from '../knob-image-input/knob-image-input';
import NumberInput from '../knob-number-input/knob-number-input';
import KnobSliderInput from '../knob-slider-input/knob-slider-input';
import KnobTextAlign from '../knob-text-align/knob-text-align';

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
    backgroundImage: cssDeclarations && cssDeclarations.backgroundImage,
    backgroundSize: cssDeclarations && cssDeclarations.backgroundSize,
    color: cssDeclarations && cssDeclarations.color,
    fontSize: cssDeclarations && cssDeclarations.fontSize,
    fontFamily: cssDeclarations && cssDeclarations.fontFamily,
    lineHeight: cssDeclarations && cssDeclarations.lineHeight,
    textAlign: cssDeclarations && cssDeclarations.textAlign,
    opacity: cssDeclarations && cssDeclarations.opacity,

    borderColor: cssDeclarations && cssDeclarations.borderColor,
    borderStyle: cssDeclarations && cssDeclarations.borderStyle,
    borderWidth: cssDeclarations && cssDeclarations.borderWidth,
    borderRadius: cssDeclarations && cssDeclarations.borderRadius,

    width: cssDeclarations && cssDeclarations.width,
    height: cssDeclarations && cssDeclarations.height,
    marginTop: cssDeclarations && cssDeclarations.marginTop,
    marginBottom: cssDeclarations && cssDeclarations.marginBottom,
    marginLeft: cssDeclarations && cssDeclarations.marginLeft,
    marginRight: cssDeclarations && cssDeclarations.marginRight,
    paddingTop: cssDeclarations && cssDeclarations.paddingTop,
    paddingBottom: cssDeclarations && cssDeclarations.paddingBottom,
    paddingLeft: cssDeclarations && cssDeclarations.paddingLeft,
    paddingRight: cssDeclarations && cssDeclarations.paddingRight,
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
        <label className="pt-small row" style={{ marginBottom: 7 }}>
          <span className="col-xs-4">
            <span className="knob-label">
              Font
            </span>
          </span>

          <span className="col-xs-8">
            <div className="pt-fill pt-select">
              <select
                value={currentStyles.fontFamily || defaultStyles.fontFamily}
                onChange={(e) => {
                  updateStylePropery({
                    id: element.id,
                    className: currentClassName,
                    property: 'fontFamily',
                    value: e.target.value,
                  });
                }}
              >
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Arial Black">Arial Black</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Impact">Impact</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
                <option value="Lucida Console">Lucida Console</option>
              </select>
            </div>
          </span>
        </label>

        <KnobTextAlign
          label="Align"
          value={currentStyles.textAlign || defaultStyles.textAlign}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'textAlign',
              value,
            });
          }}
        />

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

        <KnobColorInput
          label="Text color"
          value={currentStyles.color !== undefined ? currentStyles.color : defaultStyles.color}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'color',
              value,
            });
          }}
        />

      </KnobsBlock>

      <KnobsBlock
        title="Size"
      >
        <NumberInput
          label="Width"
          min={1}
          value={currentStyles.width || defaultStyles.width}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'width',
              value,
            });
          }}
        />

        <NumberInput
          label="Height"
          min={1}
          value={currentStyles.height || defaultStyles.height}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'height',
              value,
            });
          }}
        />

        <hr />

        <NumberInput
          label="Margin top"
          min={1}
          value={currentStyles.marginTop || defaultStyles.marginTop}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'marginTop',
              value,
            });
          }}
        />

        <NumberInput
          label="Margin right"
          min={1}
          value={currentStyles.marginRight || defaultStyles.marginRight}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'marginRight',
              value,
            });
          }}
        />

        <NumberInput
          label="Margin bottom"
          min={1}
          value={currentStyles.marginBottom || defaultStyles.marginBottom}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'marginBottom',
              value,
            });
          }}
        />

        <NumberInput
          label="Margin left"
          min={1}
          value={currentStyles.marginLeft || defaultStyles.marginLeft}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'marginLeft',
              value,
            });
          }}
        />

        <hr />

        <NumberInput
          label="Padding top"
          min={1}
          value={currentStyles.paddingTop || defaultStyles.paddingTop}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'paddingTop',
              value,
            });
          }}
        />

        <NumberInput
          label="Padding right"
          min={1}
          value={currentStyles.paddingRight || defaultStyles.paddingRight}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'paddingRight',
              value,
            });
          }}
        />

        <NumberInput
          label="Padding bottom"
          min={1}
          value={currentStyles.paddingBottom || defaultStyles.paddingBottom}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'paddingBottom',
              value,
            });
          }}
        />

        <NumberInput
          label="Padding left"
          min={1}
          value={currentStyles.paddingLeft || defaultStyles.paddingLeft}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'paddingLeft',
              value,
            });
          }}
        />
      </KnobsBlock>

      <KnobsBlock
        title="Appearance"
      >
        <KnobSliderInput
          label="Opacity"
          value={currentStyles.opacity || defaultStyles.opacity}
          min={0}
          max={1}
          stepSize={0.05}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'opacity',
              value,
            });
          }}
        />
      </KnobsBlock>

      <KnobsBlock
        title="Border"
      >
        <KnobColorInput
          label="Color"
          value={currentStyles.borderColor !== undefined ? currentStyles.borderColor : defaultStyles.borderColor}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'borderColor',
              value,
            });
          }}
        />

        <label className="pt-small row" style={{ marginBottom: 7 }}>
          <span className="col-xs-4">
            <span className="knob-label">
              Style
            </span>
          </span>

          <span className="col-xs-8">
            <div className="pt-fill pt-select">
              <select
                value={currentStyles.borderStyle || defaultStyles.borderStyle}
                onChange={(e) => {
                  updateStylePropery({
                    id: element.id,
                    className: currentClassName,
                    property: 'borderStyle',
                    value: e.target.value,
                  });
                }}
              >
                <option value="none">none</option>
                <option value="solid">solid</option>
                <option value="dashed">dashed</option>
                <option value="dotted">dotted</option>
                <option value="double">double</option>
                <option value="groove">groove</option>
                <option value="outset">outset</option>
                <option value="ridge">ridge</option>
              </select>
            </div>
          </span>
        </label>

        <NumberInput
          label="Width"
          min={1}
          value={currentStyles.borderWidth || defaultStyles.borderWidth}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'borderWidth',
              value,
            });
          }}
        />

        <NumberInput
          label="Radius"
          min={1}
          value={currentStyles.borderRadius || defaultStyles.borderRadius}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'borderRadius',
              value,
            });
          }}
        />

      </KnobsBlock>

      <KnobsBlock
        title="Background"
      >
        <KnobColorInput
          label="Color"
          value={currentStyles.backgroundColor !== undefined ? currentStyles.backgroundColor : defaultStyles.backgroundColor}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'backgroundColor',
              value,
            });
          }}
        />

        <KnobImageInput
          label="Image"
          value={currentStyles.backgroundImage || defaultStyles.backgroundImage}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'backgroundImage',
              value,
            });
          }}
        />

        <KnobButtonGroup
          label="Size"
          value={currentStyles.backgroundSize || defaultStyles.backgroundSize}
          options={[
            {
              text: 'auto',
              value: '100% auto',
            },
            {
              text: 'contain',
              value: 'contain',
            },
            {
              text: 'cover',
              value: 'cover',
            },
          ]}
          onChange={(value) => {
            updateStylePropery({
              id: element.id,
              className: currentClassName,
              property: 'backgroundSize',
              value,
            });
          }}
        />
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
