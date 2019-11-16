import React from 'react';

import styles from '../layers.module.scss';

import { ILayerData } from '../../../../utils/vnode-helpers';

import DropInBetween from './drop-in-between';
import Layer from './layer';

const LayerContainer: React.FC<{ data: ILayerData[], moveLayer: any, path?: string[] }> = ({ moveLayer, data: layers, path = [] }) => {
  const isRoot = path.length === 0;

  const renderLayer = (layer: ILayerData, index: number) => {
    const newPath = path.concat(String(index));

    if (isRoot) {
      return (
        <li key={layer.id} className={styles.layerWrapper}>
          <Layer
            index={index}
            path={newPath}
            moveLayer={moveLayer}
            isRoot={isRoot}
            layer={layer}
          />
        </li>
      );
    }

    return (
      <li key={layer.id} className={styles.layerWrapper}>
        <DropInBetween
          index={index}
          id={layer.id}
          path={newPath}
          moveLayer={moveLayer}
        />
        <Layer
          index={index}
          isRoot={isRoot}
          path={newPath}
          moveLayer={moveLayer}
          layer={layer}
        />
        <DropInBetween
          index={index + 1}
          id={layer.id}
          path={path.concat(String(index + 1))}
          moveLayer={moveLayer}
        />
      </li>
    );
  };

  return (
    <ul className={styles.layers}>
      {layers.map((layer, i) => renderLayer(layer as any, i))}
    </ul>
  );
};
export default LayerContainer;
