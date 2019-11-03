import cc from 'classcat';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { ComponentIcon, ContainerIcon, ImageIcon, TypefaceIcon, ViewIcon } from '../../../../components/icons';
import { projectContext } from '../../../../routes/editor/editor';
import { ILayerData } from '../../../../utils/create-vnode';
import styles from '../layers.module.scss';

import LayerContainer from './layer-container';

export interface IDragItem {
  index: number;
  id: string;
  type: string;
  path: number[];
}

export interface ILayerProps {
  index: number;
  layer: ILayerData;
  path: number[];
  moveLayer: (dragIndex: number[], hoverIndex: number[]) => void;
  isRoot: boolean;
}

const Layer: React.FC<ILayerProps> = ({ isRoot, index, path, moveLayer, layer }) => {
  const layerData: any = layer;
  const [showChildren, setShowChildren] = useState(true);
  const { state, setState } = useContext(projectContext);
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'layer',
    drop(item: IDragItem, monitor: DropTargetMonitor) {
      const shouldBeAbleToDrop = monitor.isOver({ shallow: true }) && canDrop && layerData.children;
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
      canDrop: monitor.canDrop() && !layerData.var && !layerData.img && !layerData.text,
    }),
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'layer', path, id: layerData.id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const isTarget = !isDragging && canDrop && isOver;
  const isActive = !state.activeElement.id && isRoot || state.activeElement.id === layer.id;
  const opacity = isDragging ? 0.5 : 1;

  // Do not drag this layer here
  if (isRoot) {
    drop(ref);
  } else {
    drag(drop(ref));
  }

  let Icon = ContainerIcon;

  if (layerData.text) {
    Icon = TypefaceIcon;
  }

  if (layerData.var) {
    Icon = TypefaceIcon;
  }

  if (layerData.component) {
    Icon = ComponentIcon;
  }

  if (layerData.node === 'img') {
    Icon = ImageIcon;
  }

  function setActiveElement() {
    setState({
      ...state,
      activeElement: {
        id: isRoot ? null : layer.id,
        path,
      },
    });
  }

  return (
    <div ref={ref} style={{ opacity }} className={cc([styles.layer, { isActive, isTarget }])}>
      <div
        className={styles.layerHandler} style={{ paddingLeft: (path.length - 1) * 10 }}
        onClick={setActiveElement}
      >
        {!isRoot && layerData.children && layerData.children.length > 0 && (
          <i className={`im im-angle-${showChildren ? 'down' : 'right'}`} onClick={(e) => {
            e.stopPropagation();
            setShowChildren((s) => !s);
          }} />
        )}
        <Icon className={styles.icon} />
        <span>
          {layerData.name || layerData.text || layerData.var || layerData.component || layerData.node}
        </span>
        <ViewIcon className={styles.displayIcon} />
      </div>
      {showChildren && layerData.children && (
        <div>
          <LayerContainer path={path} moveLayer={moveLayer} data={layerData.children} />
        </div>
      )}
    </div>
  );
};

export default Layer;
