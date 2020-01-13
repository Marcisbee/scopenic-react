import cc from 'classcat';
import React from 'react';

interface IKnobButtonGroupProps {
  label?: string;
  value?: number | string;
  options?: Array<{ text: string, value: string | number }>;
  readOnly?: boolean;
  onChange?: (value: any) => void;
}

const KnobButtonGroup: React.FC<IKnobButtonGroupProps> = ({
  label,
  value: defaultValue = 'left',
  options = [],
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
        <div className="pt-button-group">
          {options.map(({ text, value }) => (
            <a
              key={text}
              className={cc([
                'pt-button',
                (defaultValue === value)
                && 'pt-intent-primary',
              ])}
              role="button"
              onClick={() => {
                if (!readOnly && onChange) {
                  onChange(value);
                }
              }}
            >
              {text}
            </a>
          ))}
        </div>
      </span>
    </label>
  );
};

export default KnobButtonGroup;
