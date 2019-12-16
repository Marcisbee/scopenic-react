import React from 'react';

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
  return (
    <label className="pt-small row" style={{ marginBottom: 7 }}>
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
  );
};

export default KnowColorInput;
