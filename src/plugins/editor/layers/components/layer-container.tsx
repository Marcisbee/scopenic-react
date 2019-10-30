import React from 'react';

import styles from '../layers.module.scss';

import DropInBetween from './drop-in-between';
import Layer from './layer';

const LayerContainer: React.FC<{ data: Array<Record<string, any>>, moveLayer: any, path?: number[] }> = ({ moveLayer, data: layers, path = [] }) => {
  const isRoot = path.length === 0;

  const renderLayer = (layer: { id: number; text: string; children: Array<Record<string, any>> }, index: number) => {
    const newPath = path.concat(index);

    if (isRoot) {
      return (
        <li key={layer.id} className={styles.layerWrapper}>
          <Layer
            index={index}
            id={layer.id}
            path={newPath}
            text={layer.text}
            moveLayer={moveLayer}
            childData={layer.children}
            isRoot={isRoot}
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
          id={layer.id}
          path={newPath}
          text={layer.text}
          moveLayer={moveLayer}
          childData={layer.children}
          isRoot={isRoot}
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
