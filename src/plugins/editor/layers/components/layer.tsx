import cc from 'classcat';
import React, { useContext, useRef } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';

import { LayerContext } from '../context/layer';
import styles from '../layers.module.scss';

import LayerContainer from './layer-container';

export interface IDragItem {
  index: number;
  id: string;
  type: string;
  path: number[];
}

export interface ILayerProps {
  id: any;
  text: string;
  index: number;
  childData: Array<Record<string, any>>;
  path: number[];
  moveLayer: (dragIndex: number[], hoverIndex: number[]) => void;
  isRoot: boolean;
}

const Layer: React.FC<ILayerProps> = ({ isRoot, childData, id, text, index, path, moveLayer }) => {
  const layerContext = useContext(LayerContext);
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'layer',
    drop(item: IDragItem, monitor: DropTargetMonitor) {
      const shouldBeAbleToDrop = monitor.isOver({ shallow: true });
      if (!shouldBeAbleToDrop || !ref.current) {
        return;
      }

      // Don't replace items with themselves
      if (item.path.join('.') === path.join('.')) {
        return;
      }

      moveLayer(item.path, path.concat(0));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'layer', path, id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const isTarget = !isDragging && canDrop && isOver;
  const isActive = layerContext.active.join('.') === path.join('.');
  const opacity = isDragging ? 0.5 : 1;

  if (isRoot) {
    drop(ref);
  } else {
    drag(drop(ref));
  }

  return (
    <div ref={ref} style={{ opacity }} className={cc([styles.layer, { isActive, isTarget }])}>
      <div className={styles.layerHandler}>
        {text}
      </div>
      <div>
        <LayerContainer path={path} moveLayer={moveLayer} data={childData} />
      </div>
    </div>
  );
};

export default Layer;
