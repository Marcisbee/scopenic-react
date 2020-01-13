import React from 'react';
import Slider from 'react-input-slider';

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
          <span className="col-xs-8" style={{ paddingTop: 5 }}>
            <Slider
              styles={{
                track: {
                  height: 5,
                  width: '100%',
                  backgroundColor: '#eaeaea',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.03)',
                },
                active: {
                  backgroundColor: '#51ccff',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.03)',
                },
                thumb: {
                  width: 15,
                  height: 15,
                  backgroundColor: '#0a8ffb',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                },
              }}
              axis="x"
              xmin={min}
              xmax={max}
              xstep={stepSize}
              onChange={onChange && (({ x }) => onChange(x))}
              x={Number(value) || 0}
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
