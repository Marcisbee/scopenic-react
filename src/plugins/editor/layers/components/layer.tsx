import cc from 'classcat';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { ContainerIcon, ImageIcon, TypefaceIcon, ViewIcon } from '../../../../components/icons';
import { LayerContext } from '../context/layer';
import styles from '../layers.module.scss';

import LayerContainer, { ILayerData } from './layer-container';

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
  childData?: ILayerData[];
  path: number[];
  moveLayer: (dragIndex: number[], hoverIndex: number[]) => void;
  isRoot: boolean;
  type: string;
}

const Layer: React.FC<ILayerProps> = ({ isRoot, index, path, moveLayer, childData, id, text, type }) => {
  const [showChildren, setShowChildren] = useState(true);
  const layerContext = useContext(LayerContext);
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'layer',
    drop(item: IDragItem, monitor: DropTargetMonitor) {
      const shouldBeAbleToDrop = monitor.isOver({ shallow: true }) && canDrop && childData;
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
      canDrop: monitor.canDrop() && type !== 'text',
    }),
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'layer', path, id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const isTarget = !isDragging && canDrop && isOver;
  const isActive = layerContext.active.join('.') === path.join('.');
  const opacity = isDragging ? 0.5 : 1;

  // Do not drag this layer here
  if (isRoot) {
    drop(ref);
  } else {
    drag(drop(ref));
  }

  let Icon;
  switch (type) {
    case 'text': {
      Icon = TypefaceIcon;
      break;
    }
    case 'image': {
      Icon = ImageIcon;
      break;
    }
    default: {
      Icon = ContainerIcon;
    }
  }

  return (
    <div ref={ref} style={{ opacity }} className={cc([styles.layer, { isActive, isTarget }])}>
      <div className={styles.layerHandler} style={{ paddingLeft: (path.length - 1) * 10 }}>
        {!isRoot && childData && childData.length > 0 && (
          <i className={`im im-angle-${showChildren ? 'down' : 'right'}`} onClick={() => setShowChildren((s) => !s)} />
        )}
        <Icon className={styles.icon} />
        <span>
          {text}
        </span>
        <ViewIcon className={styles.displayIcon} />
      </div>
      {showChildren && childData && (
        <div>
          <LayerContainer path={path} moveLayer={moveLayer} data={childData} />
        </div>
      )}
    </div>
  );
};

export default Layer;
