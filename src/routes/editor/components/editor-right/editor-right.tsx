import cc from 'classcat';
import dlv from 'dlv';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import KnobsBlock from '../../../../components/knobs-block';
import { useRefsContext } from '../../../../utils/refs-context';
import { EditorStore } from '../../context/editor-context';

interface INumberInputProps {
  label?: string;
  min?: number;
  max?: number;
  value?: number | string;
  metric?: 'px' | 'rem' | 'em';
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

function separateValueFromMetric(data: string | number) {
  if (typeof data === 'number') {
    return {
      value: data,
    };
  }

  const value = parseInt(data, 10);
  const metric = data.replace(String(value), '');

  return {
    value,
    metric,
  };
}

const NumberInput: React.FC<INumberInputProps> = ({
  label,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  value: defaultValue = 0,
  metric: defaultMetric,
  onChange,
  readOnly,
}) => {
  const normalised = separateValueFromMetric(defaultValue);
  const value = normalised.value;
  const metric = defaultMetric || normalised.metric || 'px';

  const [isInvalid, setIsInvalid] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const handleRef = useRef<HTMLInputElement>();
  const selfRef = useRef<HTMLInputElement>();

  function handleMouseDown() {
    if (!isPointerLocked && !readOnly && handleRef.current) { handleRef.current.requestPointerLock(); }
  }
  function handleMouseUp() {
    if (isPointerLocked && !readOnly) { document.exitPointerLock(); }
  }
  function handleMouseMove({ movementY }: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    if (isPointerLocked && movementY) {
      handleValueChange(`${value}${metric}`, movementY < 0 ? 'up' : 'down');
    }
  }

  function handlePointerLockChange() {
    const locked = document.pointerLockElement === handleRef.current;
    setIsPointerLocked(locked);
  }

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const inputValue = (e.target as HTMLInputElement).value;

    if (validateValue(inputValue) && onChange) {
      onChange(inputValue);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (isPointerLocked) {
      e.preventDefault();
      return;
    }

    const target = (e.target as HTMLInputElement);
    let modifier = 1;

    if (e.shiftKey) {
      modifier = 10;
    }

    if (e.which === 38
      && handleValueChange(target.value, 'up', modifier)) {
      e.preventDefault();
    }

    if (e.which === 40
      && handleValueChange(target.value, 'down', modifier)) {
      e.preventDefault();
    }
  }

  function handleValueChange(beforeValue: string | number, direction: 'up' | 'down', modifier: number = 1) {
    const {
      value: currentValue,
      metric: currentMetric,
    } = separateValueFromMetric(beforeValue);
    let newValue: number | undefined;

    if (direction === 'up') {
      newValue = Math.min(max, currentValue + modifier);
    }

    if (direction === 'down') {
      newValue = Math.max(min, currentValue - modifier);
    }

    if (newValue !== undefined && onChange) {
      const result = `${newValue}${currentMetric}`;

      if (!validateValue(result)) {
        return;
      }

      onChange(result);

      return result;
    }
  }

  function validateValue(inputValue: string | number): boolean {
    const valid = /^\d+(px|em)$/.test(String(inputValue));

    if (selfRef.current) {
      selfRef.current.value = String(inputValue);
    }

    if (!valid) {
      setIsInvalid(true);
      return false;
    }

    if (isInvalid) {
      setIsInvalid(false);
    }

    return valid;
  }

  useEffect(() => {
    document.addEventListener(
      'pointerlockchange',
      handlePointerLockChange,
      false,
    );

    return () => {
      document.removeEventListener(
        'pointerlockchange',
        handlePointerLockChange,
      );
    };
  }, []);

  useEffect(() => {
    validateValue(`${value}${metric}`);
  }, [value, metric]);

  return (
    <label className="row">
      <span className="col-xs-4">
        {label && (
          <span style={{ display: 'block', fontSize: 13, paddingTop: 6 }}>
            {label}
          </span>
        )}
      </span>

      <span className="col-xs-8">
        <span className="pt-small pt-control-group pt-fill">
          <span className="pt-input-group">
            <span
              ref={handleRef as any}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="pt-icon im im-reset"
            />
            <input
              type="text"
              ref={selfRef as any}
              className={cc([
                'pt-input',
                isInvalid && 'pt-intent-danger',
              ])}
              defaultValue={`${value}${metric}`}
              onChange={() => { }}
              onInput={onInput}
              onKeyDown={onKeyDown}
            />
          </span>
        </span>

        {isInvalid && (
          <span className="pt-input-helper-text">
            Invalid value
          </span>
        )}
      </span>
    </label>
  );
};

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
