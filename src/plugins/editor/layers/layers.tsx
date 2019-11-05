import React, { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { LayersIcon } from '../../../components/icons';
import { IPluginInterface } from '../../../components/plugins/plugins';
import panelStyles from '../../../layouts/panel.module.scss';
import { useEditorDispatch, useEditorState } from '../../../routes/editor/context/editor-context';
import { createVNode } from '../../../utils/create-vnode';

import LayerContainer from './components/layer-container';
import styles from './layers.module.scss';

const Menu: React.FC = () => {
  return (
    <LayersIcon className={panelStyles.menuIcon} />
  );
};

const LeftPanel: React.FC = () => {
  const { state } = useEditorState();
  const editorDispatch = useEditorDispatch();

  const activePage = state.data[state.activePage];
  const layers = [
    createVNode('node', 'body', 'body', undefined, activePage.children),
  ];

  const moveLayer = useCallback(
    (dragPath: string[], hoverPath: string[]) => {
      editorDispatch({
        type: 'MOVE_ELEMENT',
        from: dragPath,
        to: hoverPath,
      });
    },
    [layers],
  );

  return (
    <div className={styles.wrapper}>
      {activePage.name}
      <div>
        <DndProvider backend={HTML5Backend}>
          <LayerContainer data={layers} moveLayer={moveLayer} />
        </DndProvider>
      </div>
      <div style={{ position: 'absolute', bottom: 0 }} className="pt-button-group">
        <a className="pt-button" onClick={() => {
          const newNode = createVNode('node', 'div', 'Container');

          editorDispatch({
            type: 'ADD_ELEMENT',
            payload: newNode,
          });
        }}>Create node</a>
        <a className="pt-button" onClick={() => {  }}>&nbsp;</a>
        <a className="pt-button" onClick={() => {  }}>&nbsp;</a>
        <a className="pt-button" onClick={() => {  }}>&nbsp;</a>
      </div>
    </div>
  );
};

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
