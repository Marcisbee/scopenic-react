import cc from 'classcat';
import dlv from 'dlv';
import React, { useMemo, useState } from 'react';

import KnobsBlock from '../../../../components/knobs-block';
import { useRefsContext } from '../../../../utils/refs-context';
import { ILayerData, isComponent } from '../../../../utils/vnode-helpers';
import { EditorStore } from '../../context/editor-context';
import KnobButtonGroup from '../knob-button-group/knob-button-group';
import KnobColorInput from '../knob-color-input/knob-color-input';
import KnobImageInput from '../knob-image-input/knob-image-input';
import NumberInput from '../knob-number-input/knob-number-input';
import KnobSliderInput from '../knob-slider-input/knob-slider-input';
import KnobSpacingInput from '../knob-spacing-input/knob-spacing-input';
import KnobTextAlign from '../knob-text-align/knob-text-align';
import { ComponentsLocal } from '../../../../components/render/render';

export const allCustomKnobs = [
  {
    type: 'textarea',
    render({ label, value, onChange }) {
      return (
        <label className="pt-small row" style={{ marginBottom: 7 }}>
          <span className="col-xs-4">
            <span className="knob-label">
              {label}
            </span>
          </span>

          <span className="col-xs-8">
            <div className="pt-fill">
              <input
                type="text"
                className="pt-input"
                value={value}
                onChange={onChange}
              />
            </div>
          </span>
        </label>
      );
    },
  },
];

export const allStyleKnobs = [];

const CustomKnobs: React.FC<{ element: ILayerData }> = React.memo(({ element }) => {
  const updateElementProp = EditorStore.useStoreActions((s) => s.updateElementProp);

  if (!isComponent(element)) {
    return null;
  }

  const componentConfig = ComponentsLocal[element.component];

  if (!componentConfig.props.custom) {
    return null;
  }

  const customKnobsToRender = Object
    .entries(componentConfig.props.custom)
    .reduce((acc, [key, config]) => {
      const knob = allCustomKnobs.find(({ type }) => type === config.type);

      if (!knob || typeof config !== 'object') {
        return acc;
      }

      return [
        ...acc,
        {
          key,
          type: knob.type,
          render: knob.render,
          name: config.name,
        },
      ];
    }, []);

  return (
    <KnobsBlock
      title="Component Properties"
    >
      {customKnobsToRender.map((knobConfig) => (
        <div key={`knob-${knobConfig.type}-${knobConfig.key}`}>
          <knobConfig.render
            label={knobConfig.name}
            value={element.props[knobConfig.key]}
            onChange={(e) => {
              updateElementProp({
                property: knobConfig.key,
                value: e.target.value,
              });
            }}
          />
        </div>
      ))}
    </KnobsBlock>
  );
});

const EditorRight: React.FC = () => {
  const [prefix, setPrefix] = useState<null | ':hover' | ':active' | ':focus'>(null);
  const refs = useRefsContext();
  const activeElement = EditorStore.useStoreState((s) => s.state.activeElement);
  const stateCss = EditorStore.useStoreState((s) => s.state.data.css);
  const pages = EditorStore.useStoreState((s) => s.state.data.pages);
  const isWorkspacePageActive = EditorStore.useStoreState((s) => s.isWorkspacePageActive);
  const updateElement = EditorStore.useStoreActions((s) => s.updateElement);
  const updateStyle = EditorStore.useStoreActions((s) => s.updateStyle);
  const updateStyleProperty = EditorStore.useStoreActions((s) => s.updateStyleProperty);

  let element: ILayerData = typeof isWorkspacePageActive === 'string'
    && dlv(pages[isWorkspacePageActive], 'children.' + activeElement.path.slice(1).join('.children.'));
  const currentClassName = (element && element.className) || (activeElement.id || 'body');
  const realClassName = element && element.className;

  const cssDeclarations = useMemo(() => {
    if (!refs.workspace || !refs.workspace.current) {
      return;
    }

    const node: HTMLIFrameElement = (refs.workspace.current as any).node;

    if (!(node && node.contentDocument)) {
      return;
    }

    if (activeElement.id === null) {
      const el = node.contentDocument.body;

      if (el) {
        return { ...window.getComputedStyle(el) };
      }
    }

    if (activeElement.id) {
      const el = realClassName
        ? node.contentDocument.querySelector(`.${currentClassName}`)
        : node.contentDocument.getElementById(currentClassName);

      if (el) {
        return { ...window.getComputedStyle(el) };
      }
    }
  }, [activeElement.id, activeElement.path.toString(), prefix, !!refs.workspace.current]);

  if (!element) {
    element = {} as any;
  }

  const currentStyles = (prefix ? (stateCss[currentClassName] && (stateCss[currentClassName] as any)[prefix]) : stateCss[currentClassName]) || {};

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
    margin: cssDeclarations && cssDeclarations.margin,
    padding: cssDeclarations && cssDeclarations.padding,
  };

  if (!currentClassName) {
    return null;
  }

  const knobsToRender = [...allStyleKnobs];

  return (
    <div>
      <br />
      <br />

      <CustomKnobs element={element} />

      <label className="pt-small">
        <div className="pt-button-group" style={{ padding: 6, textAlign: 'center' }}>
          {[
            {
              text: 'none',
              value: null,
            },
            {
              text: ':hover',
              value: ':hover',
            },
            {
              text: ':active',
              value: ':active',
            },
            {
              text: ':focus',
              value: ':focus',
            },
          ].map(({ text, value }) => (
            <a
              key={text}
              className={cc([
                'pt-button',
                (prefix === value)
                && 'pt-intent-primary',
              ])}
              role="button"
              onClick={() => {
                if (setPrefix) {
                  setPrefix(value as any);
                }
              }}
            >
              {text}
            </a>
          ))}
        </div>
      </label>

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
                  updateStyleProperty({
                    prefix,
                    id: element.id,
                    className: realClassName,
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
              property: 'lineHeight',
              value,
            });
          }}
        />

        <KnobColorInput
          label="Text color"
          value={currentStyles.color !== undefined ? currentStyles.color : defaultStyles.color}
          onChange={(value) => {
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
              property: 'color',
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
              property: 'opacity',
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
              property: 'backgroundColor',
              value,
            });
          }}
        />

        <KnobImageInput
          label="Image"
          value={currentStyles.backgroundImage || defaultStyles.backgroundImage}
          onChange={(value) => {
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
              property: 'backgroundSize',
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
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
                  updateStyleProperty({
                    prefix,
                    id: element.id,
                    className: realClassName,
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
              property: 'borderRadius',
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
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
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
              property: 'height',
              value,
            });
          }}
        />

      </KnobsBlock>

      <KnobsBlock
        title="Spacing"
      >
        <KnobSpacingInput
          label="Margin"
          value={currentStyles.margin || defaultStyles.margin}
          onChange={(value) => {
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
              property: 'margin',
              value,
            });
          }}
        />

        <hr />

        <KnobSpacingInput
          label="Padding"
          value={currentStyles.padding || defaultStyles.padding}
          onChange={(value) => {
            updateStyleProperty({
              prefix,
              id: element.id,
              className: realClassName,
              property: 'padding',
              value,
            });
          }}
        />
      </KnobsBlock>

      <hr />

      Selected element: {JSON.stringify(activeElement)}
      <br />
      ClassName: {currentClassName || <i>NONE</i>}
      <h2>Element:</h2>
      <pre
        style={{ fontSize: 12 }}
        contentEditable={true}
        onBlur={(e) => {
          try {
            const value = JSON.parse(e.target.innerText);

            updateElement({ path: activeElement.path.slice(1), element: value });
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
      {activeElement.id && (
        <pre
          style={{ fontSize: 12 }}
          contentEditable={true}
          onBlur={(e) => {
            const key = activeElement.id;
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
              dlv(stateCss, currentClassName),
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
