import React from 'react';

import { ILayerData } from '../../../../utils/create-vnode';
import styles from '../layers.module.scss';

import DropInBetween from './drop-in-between';
import Layer from './layer';

const LayerContainer: React.FC<{ data: ILayerData[], moveLayer: any, path?: number[] }> = ({ moveLayer, data: layers, path = [] }) => {
  const isRoot = path.length === 0;

  const renderLayer = (layer: ILayerData, index: number) => {
    const newPath = path.concat(index);

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
          path={path.concat(index + 1)}
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