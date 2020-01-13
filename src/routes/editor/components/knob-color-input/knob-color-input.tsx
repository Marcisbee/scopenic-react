import React, { useRef, useState } from 'react';
import { ChromePicker } from 'react-color';
import { useOnClickOutside } from '../../../../hooks/use-on-click-outside';

interface IKnowColorInputProps {
  label?: string;
  value?: null | string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

const KnowColorInput: React.FC<IKnowColorInputProps> = ({
  label,
  value: defaultValue = '#fff',
  onChange,
  readOnly,
}) => {
  const [show, setShow] = useState(false);
  const ref = useRef(null as unknown as HTMLDivElement);
  useOnClickOutside(ref, () => {
    setShow(false);
  });

  return (
    <div ref={ref}>
      <label className="pt-small row" style={{ marginBottom: 7 }} onFocus={() => setShow(true)}>
        <span className="col-xs-4">
          {label && (
            <span className="knob-label">
              {label}
            </span>
          )}
        </span>

        <span className="col-xs-8">
          <span className="pt-input-color pt-small pt-control-group pt-fill">
            <span
              className="color-backdrop"
              style={{
                backgroundColor: defaultValue || '',
              }}
            />
            <span className="pt-input-group">
              <span
                className="color-bull"
                style={{
                  backgroundColor: defaultValue || '',
                }}
              />
              <input
                className="pt-input"
                type="text"
                value={defaultValue || ''}
                onChange={(e) => {
                  if (onChange) {
                    onChange(e.target.value);
                  }
                }}
              />
            </span>
          </span>
        </span>
      </label>

      {show && (
        <div style={{ position: 'absolute', zIndex: 10 }}>
          <ChromePicker
            color={defaultValue || ''}
            onChange={onChange && (({ hex, rgb }) => {
              if (rgb.a !== undefined && rgb.a < 1) {
                onChange(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`);
                return;
              }

              onChange(hex);
            })}
          />
        </div>
      )}
    </div>
  );
};

export default KnowColorInput;
