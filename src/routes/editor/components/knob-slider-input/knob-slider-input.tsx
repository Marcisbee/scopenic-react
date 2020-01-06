import { Slider } from '@blueprintjs/core';
import React from 'react';

interface IKnobSliderInputProps {
  label?: string;
  min?: number;
  max?: number;
  value?: string | number | null;
  stepSize?: number;
  onChange?: (value: number) => void;
}

const KnobSliderInput: React.FC<IKnobSliderInputProps> = ({
  label,
  min = 0,
  max = 10,
  value = 0,
  stepSize = 1,
  onChange,
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
        <span className="row">
          <span className="col-xs-8" style={{ paddingTop: 7 }}>
            <Slider
              min={min}
              max={max}
              stepSize={stepSize}
              onChange={onChange}
              value={Number(value) || 0}
              vertical={false}
              labelRenderer={false}
            />
          </span>
          <span className="col-xs-4">
            <input
              className="pt-input"
              type="number"
              value={value || ''}
              style={{
                width: '100%',
              }}
              onChange={(e) => {
                if (onChange) {
                  onChange(
                    Math.max(
                      0,
                      Math.min(
                        1,
                        Number(e.target.value),
                      ),
                    ),
                  );
                }
              }}
            />
          </span>
        </span>
      </span>
    </label>
  );
};

export default KnobSliderInput;
