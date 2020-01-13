import React from 'react';

import InteractiveNumberInput from '../interactive-number-input/interactive-number-input';

interface INumberInputProps {
  label?: string;
  min?: number;
  max?: number;
  value?: number | string;
  metric?: 'px' | 'rem' | 'em';
  readOnly?: boolean;
  onChange?: (value: string) => void;
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
  return (
    <label className="row" style={{ marginBottom: 7 }}>
      <span className="col-xs-4">
        {label && (
          <span className="knob-label">
            {label}
          </span>
        )}
      </span>

      <span className="col-xs-8">
        <InteractiveNumberInput
          min={min}
          max={max}
          value={defaultValue}
          metric={defaultMetric}
          onChange={onChange}
          readOnly={readOnly}
        />
      </span>
    </label>
  );
};

export default NumberInput;
