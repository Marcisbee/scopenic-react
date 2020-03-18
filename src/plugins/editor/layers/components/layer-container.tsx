import React from 'react';

import styles from '../layers.module.scss';

import { ILayerData } from '../../../../utils/vnode-helpers';

import DropInBetween from './drop-in-between';
import Layer from './layer';

const RenderLayer: React.FC<{ moveLayer: any, path: string[], layer: ILayerData, index: number }> = ({ path, moveLayer, layer, index }) => {
  const isRoot = path.length === 0;
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

const RenderLayerMemo = React.memo(RenderLayer, (prev, next) => true);
// const RenderLayerMemo = RenderLayer;

const LayerContainer: React.FC<{ data: ILayerData[], moveLayer: any, path?: string[] }> = ({ moveLayer, data: layers, path = [] }) => {
  return (
    <ul className={styles.layers}>
      {layers.map((layer, i) => (
        <RenderLayerMemo
          key={`render-layer-${layer.id}`}
          layer={layer}
          moveLayer={moveLayer}
          path={path}
          index={i}
        />
      ))}
      {/* {layers.map((layer, i) => RenderLayer(layer as any, i))} */}
    </ul>
  );
};
export default LayerContainer;
