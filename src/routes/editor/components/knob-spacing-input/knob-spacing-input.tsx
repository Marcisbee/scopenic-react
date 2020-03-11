import cc from 'classcat';
import React from 'react';

import InteractiveNumberInput from '../interactive-number-input/interactive-number-input';

interface IKnobSpacingInputProps {
  label?: string;
  min?: number;
  max?: number;
  value?: number | string;
  readOnly?: boolean;
  onChange?: (value: any) => void;
}

interface IValueProp {
  value: number;
  metric: string;
}

function separateValueFromMetric(data: string | number): IValueProp {
  if (typeof data === 'number') {
    return {
      value: data,
      metric: 'px',
    };
  }

  const value = parseInt(data, 10);
  const metric = data.replace(String(value), '');

  return {
    value,
    metric,
  };
}

const extractSeparateValues = (value: string): [IValueProp, IValueProp, IValueProp, IValueProp] => {
  const values = value.split(' ');
  const [top, right, bottom, left] = values.map((val) => {
    return separateValueFromMetric(val);
  });

  if (values.length < 2) {
    return [
      top,
      top,
      top,
      top,
    ];
  }

  if (values.length < 3) {
    return [
      top,
      right,
      top,
      right,
    ];
  }

  if (values.length < 4) {
    return [
      top,
      right,
      bottom,
      right,
    ];
  }

  return [
    top,
    right,
    bottom,
    left,
  ];
};

const KnobSpacingInput: React.FC<IKnobSpacingInputProps> = ({
  label,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  value: defaultValue = '0 0 0 0',
  onChange,
  readOnly,
}) => {
  const normalised = extractSeparateValues(String(defaultValue));

  const handleValueChange = (value: string, index: number) => {
    if (!onChange) {
      return;
    }

    const newValue = normalised
      .map((val, i) => (
        i === index ? value : `${val.value}${val.metric}`
      ))
      .join(' ');

    onChange(newValue);
  };

  return (
    <label className="pt-small row" style={{ marginBottom: 7 }} onClick={(e) => {
      e.preventDefault();
    }}>
      <span className="col-xs-4">
        {label && (
          <span className="knob-label">
            {label}
          </span>
        )}
      </span>

      <span className="col-xs-8">
        <span className="row" style={{ marginBottom: 8 }}>
          <span className="col-xs-3" />
          <span className="col-xs-6">
            <InteractiveNumberInput
              min={min}
              max={max}
              value={normalised[0].value}
              metric={normalised[0].metric as any}
              onChange={(v) => handleValueChange(v, 0)}
              readOnly={readOnly}
            />
          </span>
        </span>

        <span className="row" style={{ marginBottom: 8 }}>
          <span className="col-xs-6">
            <InteractiveNumberInput
              min={min}
              max={max}
              value={normalised[3].value}
              metric={normalised[3].metric as any}
              onChange={(v) => handleValueChange(v, 3)}
              readOnly={readOnly}
            />
          </span>
          <span className="col-xs-6">
            <InteractiveNumberInput
              min={min}
              max={max}
              value={normalised[1].value}
              metric={normalised[1].metric as any}
              onChange={(v) => handleValueChange(v, 1)}
              readOnly={readOnly}
            />
          </span>
        </span>

        <span className="row">
          <span className="col-xs-3" />
          <span className="col-xs-6">
            <InteractiveNumberInput
              min={min}
              max={max}
              value={normalised[2].value}
              metric={normalised[2].metric as any}
              onChange={(v) => handleValueChange(v, 2)}
              readOnly={readOnly}
            />
          </span>
        </span>
      </span>
    </label>
  );
};

export default KnobSpacingInput;
