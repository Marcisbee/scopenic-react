import cc from 'classcat';
import React, { useRef } from 'react';

import { useOnClickOutside } from '../../../../../hooks/use-on-click-outside';
import { EditorStore } from '../../../../../routes/editor/context/editor-context';
import styles from '../../layers.module.scss';

const ListPagesPopup: React.FC<{
  edit: (route: string) => void,
  close: () => void,
}> = ({ edit, close }) => {
  const activePageKey = EditorStore.useStoreState((a) => a.state.activePage);
  const pages = EditorStore.useStoreState((a) => a.state.data.pages);
  const pageKeys = Object.keys(pages);
  const ref = useRef<any>();
  useOnClickOutside(ref, close);
  const {
    setActivePage,
  } = EditorStore.useStoreActions((a) => a);

  const selectPage = (path: string) => {
    setActivePage({ path });
  };

  return (
    <div
      ref={ref}
      className={styles.pagesList}
    >
      <strong>
        Select page
      </strong>

      <ul>
        {pageKeys.map((key) => (
          <li
            key={`page-${key}`}
            className={cc({
              isActive: key === activePageKey,
            })}
            onClick={() => {
              selectPage(key);
            }}
          >
            <i className="im im-file-o" />
            <span>{key} <strong>({pages[key].name})</strong></span>
            <button
              onClick={() => {
                edit(key);
                close();
              }}
              className={styles.pageEditButton}
            >
              <i className="im im-pencil" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListPagesPopup;
