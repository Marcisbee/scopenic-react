import dlv from 'dlv';
import React, { useCallback, useContext, useState } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { LayersIcon } from '../../../components/icons';
import { IPluginInterface } from '../../../components/plugins/plugins';
import panelStyles from '../../../layouts/panel.module.scss';
import { projectContext } from '../../../routes/editor/editor';
import { createVNode, ILayerData } from '../../../utils/create-vnode';

import LayerContainer from './components/layer-container';
import { LayerContext, layerContextInitial } from './context/layer';
import styles from './layers.module.scss';

const Menu: React.FC = () => {
  return (
    <LayersIcon className={panelStyles.menuIcon} />
  );
};

const LeftPanel: React.FC = () => {
  const { state, setState } = useContext(projectContext as any);

  const activePage = state.data[state.activePage];
  const layers = [
    createVNode('node', 'body', 'body', activePage.children),
  ];

  const moveLayer = useCallback(
    (dragPath: number[], hoverPath: number[]) => {
      const dragLayer = dlv(layers, dragPath.join('.children.'));

      const dragIndex = dragPath.slice(-1)[0];
      const dragParentPath = dragPath.slice(0, -1);
      const dragParent = dlv(layers, dragParentPath.join('.children.') + '.children') || layers;

      const hoverIndex = hoverPath.slice(-1)[0];
      const hoverParentPath = hoverPath.slice(0, -1);
      const hoverParent = dlv(layers, hoverParentPath.join('.children.') + '.children') || layers;

      dragParent.splice(dragIndex, 1);

      if (dragParent === hoverParent) {
        hoverParent.splice(dragIndex < hoverIndex ? hoverIndex - 1 : hoverIndex, 0, dragLayer);
      } else {
        hoverParent.splice(hoverIndex, 0, dragLayer);
      }

      setState({ ...state });
    },
    [layers],
  );

  return (
    <LayerContext.Provider value={layerContextInitial}>
      <div className={styles.wrapper}>
        {activePage.name}
        <div>
          <DndProvider backend={HTML5Backend}>
            <LayerContainer data={layers} moveLayer={moveLayer} />
          </DndProvider>
        </div>
      </div>
    </LayerContext.Provider>
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
