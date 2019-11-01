import dlv from 'dlv';
import React, { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { LayersIcon } from '../../../components/icons';
import { IPluginInterface } from '../../../components/plugins/plugins';
import panelStyles from '../../../layouts/panel.module.scss';

import LayerContainer, { ILayerData } from './components/layer-container';
import { LayerContext, layerContextInitial } from './context/layer';
import styles from './layers.module.scss';

const Menu: React.FC = () => {
  return (
    <LayersIcon className={panelStyles.menuIcon} />
  );
};

const LeftPanel: React.FC = () => {
  const [layers, setLayers] = useState<ILayerData[]>([
    {
      id: 0,
      text: 'body',
      type: 'container',
      children: [
        {
          id: 1,
          text: 'div .sidebar',
          type: 'text',
        },
        {
          id: 2,
          text: 'header',
          type: 'component',
          children: [
            {
              id: 8,
              text: 'Hello world',
              type: 'text',
            },
            {
              id: 9,
              text: 'img .logo',
              type: 'image',
              children: [],
            },
            {
              id: 10,
              text: 'div',
              type: 'container',
              children: [],
            },
          ],
        },
        {
          id: 3,
          text: 'div .container',
          type: 'container',
          children: [],
        },
        {
          id: 4,
          text: 'footer',
          type: 'container',
          children: [],
        },
      ],
    },
  ]);

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

      setLayers(layers.slice());
    },
    [layers],
  );

  return (
    <LayerContext.Provider value={layerContextInitial}>
      <div className={styles.wrapper}>
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
