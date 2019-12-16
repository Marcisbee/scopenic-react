import cc from 'classcat';
import React, { useEffect, useRef, useState } from 'react';

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
    const valid = /^\d+(\.\d+)?(px|em)$/.test(String(inputValue));

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

export default NumberInput;
