import cc from 'classcat';
import React from 'react';

import { TextAlignCenter, TextAlignJustify, TextAlignLeft, TextAlignRight } from '../../../../components/icons';

interface IKnobTextAlignProps {
  label?: string;
  value?: number | string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

const KnobTextAlign: React.FC<IKnobTextAlignProps> = ({
  label,
  value: defaultValue = 'left',
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
        <div className="text-align-group-knob pt-button-group">
          <a
            className={cc([
              'pt-button',
              (defaultValue === 'left')
              && 'pt-intent-primary',
            ])}
            role="button"
            onClick={() => {
              if (!readOnly && onChange) {
                onChange('left');
              }
            }}
          >
            <TextAlignLeft />
          </a>
          <a
            className={cc([
              'pt-button',
              (defaultValue === 'center')
              && 'pt-intent-primary',
            ])}
            role="button"
            onClick={() => {
              if (!readOnly && onChange) {
                onChange('center');
              }
            }}
          >
            <TextAlignCenter />
          </a>
          <a
            className={cc([
              'pt-button',
              (defaultValue === 'right')
              && 'pt-intent-primary',
            ])}
            role="button"
            onClick={() => {
              if (onChange) {
                onChange('right');
              }
            }}
          >
            <TextAlignRight />
          </a>
          <a
            className={cc([
              'pt-button',
              (defaultValue === 'justify')
              && 'pt-intent-primary',
            ])}
            role="button"
            onClick={() => {
              if (!readOnly && onChange) {
                onChange('justify');
              }
            }}
          >
            <TextAlignJustify />
          </a>
        </div>
      </span>
    </label>
  );
};

export default KnobTextAlign;
