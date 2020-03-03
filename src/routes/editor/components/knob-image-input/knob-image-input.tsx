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
          >
            <input type="file" onChange={(event) => {
              if (!event || !event.target || !event.target.files) {
                return;
              }

              event.preventDefault();

              const file = event.target.files[0];
              const formData = new FormData();

              formData.append('image', file);

              fetch(`http://localhost:8080/images/upload`, {
                method: 'POST',
                body: formData,
              })
                .then(res => res.json())
                .then(response => {
                  setImage(`http://localhost:8080${response.path}`);
                });
            }} />
            Upload image
          </a>
        )}
      </span>
    </label>
  );
};

export default KnobImageInput;
