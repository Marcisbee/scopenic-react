import React, { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { LayersIcon } from '../../../components/icons';
import { IPluginInterface } from '../../../components/plugins/plugins';
import panelStyles from '../../../layouts/panel.module.scss';
import { EditorStore } from '../../../routes/editor/context/editor-context';
import { createVNode } from '../../../utils/create-vnode';

import AddElement from './components/add-element';
import LayerContainer from './components/layer-container';
import styles from './layers.module.scss';

const Menu: React.FC = () => {
  return (
    <LayersIcon className={panelStyles.menuIcon} />
  );
};

const LeftPanel: React.FC = React.memo(() => {
  const activePage = EditorStore.useStoreState((a) => a.state.data.pages[a.state.activePage]);
  const { moveElement, removeElement, duplicateElement } = EditorStore.useStoreActions((a) => a);

  // const activePage = state.data.pages[state.activePage];
  const layers = [
    createVNode('node', 'body', 'body', undefined, activePage.children),
  ];

  const moveLayer = useCallback(
    (dragPath: string[], hoverPath: string[]) => {
      moveElement({ from: dragPath, to: hoverPath });
    },
    [layers],
  );

  return (
    <div className={styles.wrapper}>
      <div>
        {activePage.name}
      </div>

      <div>
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
});

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

export = plugin;
