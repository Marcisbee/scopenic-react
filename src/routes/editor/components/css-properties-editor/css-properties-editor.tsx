import * as React from 'react';

import styles from './css-properties-editor.module.scss';

export interface IPropertyChange {
  property: string;
  value: string;
}

interface ICssPropertiesEditor {
  rules: Record<string, string>;
  onChange: (previous: IPropertyChange, next: IPropertyChange) => void;
}

export function CssPropertiesEditor({
  rules,
  onChange,
}: ICssPropertiesEditor) {
  const [edit, setEdit] = React.useState<string | null>(null);
  function changeHandler(previous: [string, string], next: [string, string]) {
    onChange({
      property: previous[0],
      value: previous[1],
    }, {
      property: next[0],
      value: next[1],
    });
  }

  let cached: any = [];

  return (
    <div className={styles.block}>
      <span>element {'{'}</span>
      {Object.entries(rules).map(([key, value]) => (
        <div className={styles.rule} key={`${key}-${value}`}>
          {edit !== key && (
            <input
              type="checkbox"
              className={styles.checkbox}
              defaultChecked={true}
              onChange={() => { }}
            />
          )}
          <span
            tabIndex={1}
            className={styles.property}
            contentEditable={true}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();

                e.target.nextElementSibling.focus();
              }
            }}
            onFocus={() => setEdit(key)}
            onBlur={(e) => {
              setEdit(null);
              cached = [e.target.innerText, cached[1] || value];
              changeHandler([key, value], cached);
            }}
            dangerouslySetInnerHTML={{
              __html: key
              // .replace(/[A-Z]/, (match) => `-${match.toLowerCase()}`)
            }}
          />:
          <span
            tabIndex={1}
            className={styles.value}
            contentEditable={true}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const next = e.target.parentElement.nextElementSibling;

                if (!next) {
                  return;
                }

                const child = next.children[1];

                if (!child) {
                  return;
                }

                child.focus();
              }
            }}
            onFocus={() => setEdit(key)}
            onBlur={(e) => {
              setEdit(null);
            }}
            onInput={(e) => {
              cached = [cached[0] || key, (e.target as any).innerText];
              changeHandler([key, value], cached);
            }}
            dangerouslySetInnerHTML={{
              __html: value
            }}
          />;
        </div>
      ))}
      <span>{'}'}</span>
    </div>
  );
}

export const CssPropertiesEditorMemo = React.memo(CssPropertiesEditor, () => true);