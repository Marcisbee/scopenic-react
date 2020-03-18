import cc from 'classcat';
import React, { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { LayersIcon } from '../../../components/icons';
import { IPluginInterface } from '../../../components/plugins/plugins';
import panelStyles from '../../../layouts/panel.module.scss';
import { EditorStore } from '../../../routes/editor/context/editor-context';
import { createVNode } from '../../../utils/create-vnode';

import AddElement from './components/add-element';
import AddPagePopup from './components/add-page/add-page';
import EditPagePopup from './components/edit-page/edit-page';
import LayerContainer from './components/layer-container';
import ListPagesPopup from './components/list-pages/list-pages';
import styles from './layers.module.scss';

const Menu: React.FC = () => {
  return (
    <LayersIcon className={panelStyles.menuIcon} />
  );
};

const LeftPanel: React.FC = React.memo(() => {
  const [pageSelectPopup, setPageSelectPopup] = useState(false);
  const [pageAddPopup, setPageAddPopup] = useState(false);
  const [pageEditPopup, setPageEditPopup] = useState<string | null>(null);
  const activePageKey = EditorStore.useStoreState((a) => a.isWorkspacePageActive);
  const pages = EditorStore.useStoreState((a) => a.state.data.pages);
  const activePage = typeof activePageKey === 'string' ? pages[activePageKey] : {
    name: null,
    children: [],
  };
  const moveElement = EditorStore.useStoreActions((a) => a.moveElement);
  const removeElement = EditorStore.useStoreActions((a) => a.removeElement);
  const duplicateElement = EditorStore.useStoreActions((a) => a.duplicateElement);

  const layers = [
    createVNode('node', 'body', 'body', undefined, activePage.children, null, '1', 'body-vnode'),
  ];

  const moveLayer = useCallback(
    (dragPath: string[], hoverPath: string[]) => {
      moveElement({ from: dragPath, to: hoverPath });
    },
    [layers],
  );

  const closeAddPagePopup = () => {
    setPageAddPopup(false);
  };

  const closeEditPagePopup = () => {
    setPageEditPopup(null);
  };

  const closeListPagesPopup = () => {
    setPageSelectPopup(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.pages}>
        <div
          className={styles.currentPage}
          onClick={() => setPageSelectPopup(true)}
        >
          <span>
            <strong>
              {activePage.name
                ? activePage.name
                : <i style={{ opacity: '0.5' }}>Nothing selected</i>}
            </strong>
          </span>
          <i className="im-group">
            <i className="im im-care-down" />
            <i className="im im-care-up" />
          </i>
        </div>

        {pageSelectPopup && (
          <ListPagesPopup edit={setPageEditPopup} close={closeListPagesPopup} />
        )}

        {pageAddPopup && (
          <AddPagePopup close={closeAddPagePopup} />
        )}

        {pageEditPopup && (
          <EditPagePopup route={pageEditPopup} close={closeEditPagePopup} />
        )}

        <button
          className={cc([styles.addPageButton, 'pt-button'])}
          onClick={() => setPageAddPopup(true)}
        >
          <i className="im im-plus" />
        </button>
      </div>

      <div className={styles.content}>
        <DndProvider backend={HTML5Backend}>
          <LayerContainer data={layers} moveLayer={moveLayer} />
        </DndProvider>
      </div>

      <div style={{ position: 'absolute', bottom: 0 }} className="pt-button-group">
        <AddElement showOnClick={true}>
          {(props) => (
            <button className="pt-button" {...props}>Add</button>
          )}
        </AddElement>
        <a className="pt-button" onClick={() => {
          removeElement({});
        }}>Remove</a>
        <a className="pt-button" onClick={() => {
          duplicateElement({});
        }}>Duplicate</a>
      </div>
    </div>
  );
}, () => true);

const plugin: IPluginInterface = {
  'editor.panel.menu': {
    action: 'layers',
    render: Menu,
  },
  'editor.panel.left': {
    action: 'layers',
    render: LeftPanel,
  },
};

export default plugin;
