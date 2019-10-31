import React from 'react';

import styles from '../layers.module.scss';

import DropInBetween from './drop-in-between';
import Layer from './layer';

export interface ILayerData {
  id: number;
  text: string;
  type: string;
  children?: ILayerData[];
}

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
            id={layer.id}
            text={layer.text}
            childData={layer.children}
            type={layer.type}
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
          text={layer.text}
          moveLayer={moveLayer}
        />
        <Layer
          index={index}
          isRoot={isRoot}
          path={newPath}
          moveLayer={moveLayer}
          id={layer.id}
          text={layer.text}
          childData={layer.children}
          type={layer.type}
        />
        <DropInBetween
          index={index + 1}
          id={layer.id}
          path={path.concat(index + 1)}
          text={layer.text}
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
