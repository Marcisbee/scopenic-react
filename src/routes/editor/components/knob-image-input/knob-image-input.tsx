import cc from 'classcat';
import React from 'react';

import styles from './knob-image-input.module.scss';

interface IKnobImageInputProps {
  label?: string;
  value?: string | null;
  onChange?: (value: string) => void;
}

const REGEX_CSS_URL = /^url\(["'](.*)["']\)$/;

const KnobImageInput: React.FC<IKnobImageInputProps> = ({
  label,
  value,
  onChange,
}) => {
  // @TODO: Make upload real
  const imageUrl = value && REGEX_CSS_URL.test(value) && value.trim().replace(REGEX_CSS_URL, '$1');

  const setImage = (url: string | null) => {
    if (!onChange) {
      return;
    }

    if (!url) {
      onChange(`none`);
      return;
    }

    onChange(`url("${url}")`);
  };

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
        {imageUrl && (
          <span className={styles.image}>
            <span className={cc([
              styles.actionGroup,
              'pt-button-group',
            ])}>
              <a
                className="pt-button"
                role="button"
                onClick={() => {
                  setImage(null);
                }}
              >
                Replace
              </a>
              <a
                className="pt-button pt-intent-danger"
                role="button"
                onClick={() => {
                  setImage(null);
                }}
              >
                Remove
              </a>
            </span>
            <img src={imageUrl} alt="image" />
          </span>
        )}

        {!imageUrl && (
          <a
            className="pt-button pt-fill"
            role="button"
            onClick={() => setImage('https://img2.goodfon.com/wallpaper/nbig/a/25/makro-listik-listochek-listya-95.jpg')}
          >
            Upload image
          </a>
        )}
      </span>
    </label>
  );
};

export default KnobImageInput;
