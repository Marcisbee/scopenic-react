import cc from 'classcat';
import React, { useContext } from 'react';
import { DndContext, useDrop } from 'react-dnd';

import styles from '../layers.module.scss';

import { IDragItem } from './layer';

const DropInBetween: React.FC<any> = ({ path, moveLayer }) => {
  const { dragDropManager } = useContext(DndContext);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'layer',
    drop(item: IDragItem) {
      // Don't replace items with themselves
      if (path.join('.') === item.path.join('.')) {
        return;
      }

      moveLayer(item.path, path);
    },
    collect: (m) => ({
      isOver: m.isOver(),
      canDrop: m.canDrop(),
    }),
  });

  if (!dragDropManager) {
    return null;
  }

  const monitor = (dragDropManager as any).monitor;

  if (!monitor) {
    return null;
  }

  const didDrop = monitor.didDrop();
  const itemType = monitor.getItemType();

  if (didDrop || !itemType) {
    return null;
  }

  return (
    <div
      ref={drop}
      className={cc([
        styles.dropInBetween,
        {
          active: canDrop && isOver,
        },
      ])}
    />
  );
};

export default DropInBetween;
