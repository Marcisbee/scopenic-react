import cc from 'classcat';
import React, { useEffect, useRef, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { ComponentIcon, ContainerIcon, HideIcon, TypefaceIcon, ViewIcon } from '../../../../components/icons';
import { EditorStore } from '../../../../routes/editor/context/editor-context';
import { ILayerData, isComponent, isVar } from '../../../../utils/vnode-helpers';
import styles from '../layers.module.scss';

import { ComponentsLocal } from '../../../../components/render/render';
import LayerContainer from './layer-container';

export interface IDragItem {
  index: number;
  id: string;
  type: string;
  path: string[];
}

export interface ILayerProps {
  index: number;
  layer: ILayerData;
  path: string[];
  moveLayer: (dragIndex: string[], hoverIndex: string[]) => void;
  isRoot: boolean;
}

const Layer: React.FC<ILayerProps> = ({ isRoot, index, path, moveLayer, layer }) => {
  const layerData: ILayerData = layer;
  const [showChildren, setShowChildren] = useState(true);
  const activeElement = EditorStore.useStoreState((s) => s.state.activeElement);
  const setActiveElement = EditorStore.useStoreActions((s) => s.setActiveElement);
  const hideElement = EditorStore.useStoreActions((s) => s.hideElement);
  const showElement = EditorStore.useStoreActions((s) => s.showElement);
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'layer',
    drop(item: IDragItem, monitor: DropTargetMonitor) {
      const shouldBeAbleToDrop = monitor.isOver({ shallow: true }) && canDrop && (layerData as any).children;
      if (!shouldBeAbleToDrop || !ref.current) {
        return;
      }

      // Don't replace items with themselves
      if (item.path.join('.') === path.join('.')) {
        return;
      }

      moveLayer(item.path, path.concat('0'));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop() && !(layerData as any).var && !(layerData as any).img && !(layerData as any).text && (layerData as any).children,
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
  const isActive = !activeElement.id && isRoot || activeElement.id === layer.id;
  const isHidden = !!layerData.hide;
  const opacity = isDragging ? 0.5 : 1;

  // Do not drag this layer here
  if (isRoot) {
    drop(ref);
  } else {
    drag(drop(ref));
  }

  const localComponent = isComponent(layerData) && ComponentsLocal[layerData.component];
  let Icon = ContainerIcon;

  if (isVar(layerData)) {
    Icon = TypefaceIcon;
  }

  if (isComponent(layerData) && layerData.component !== 'text') {
    Icon = ComponentIcon;
  }

  if (localComponent && localComponent.icon) {
    Icon = localComponent.icon;
  }

  function setActiveElementMethod() {
    setActiveElement({ id: isRoot ? null : layer.id, path });
  }

  function handleLayerHide(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    event.preventDefault();
    event.stopPropagation();

    hideElement({ path });
  }

  function handleLayerShow(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    event.preventDefault();
    event.stopPropagation();

    showElement({ path });
  }

  return (
    <div ref={ref} style={{ opacity }} className={cc([styles.layer, { isActive, isTarget, isHidden }])}>
      <div
        className={styles.layerHandler} style={{ paddingLeft: (path.length - 1) * 10 }}
        onClick={setActiveElementMethod}
      >
        <div>
          {!isRoot && (layerData as any).children && (layerData as any).children.length > 0 && (
            <i className={`im im-angle-${showChildren ? 'down' : 'right'}`} onClick={(e) => {
              e.stopPropagation();
              setShowChildren((s) => !s);
            }} />
          )}
          <Icon className={styles.icon} />
          <span>
            {layerData.name || (layerData as any).text || (layerData as any).var || (layerData as any).component || (layerData as any).node}
          </span>
          {!layerData.hide
            ? (
              <i onClick={handleLayerHide} className={styles.displayIcon}>
                <ViewIcon />
              </i>
            ) : (
              <i onClick={handleLayerShow} className={cc([styles.displayIcon, 'active'])}>
                <HideIcon />
              </i>
            )}
        </div>
      </div>
      {showChildren && (layerData as any).children && (
        <div className={styles.layerWrapper}>
          <LayerContainer path={path} moveLayer={moveLayer} data={(layerData as any).children} />
        </div>
      )}
    </div>
  );
};

export default Layer;
