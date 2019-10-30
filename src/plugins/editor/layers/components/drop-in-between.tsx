import cc from 'classcat';
import React from 'react';
import { useDrop } from 'react-dnd';

import styles from '../layers.module.scss';

import { IDragItem } from './layer';

const DropInBetween: React.FC<any> = ({ path, moveLayer }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'layer',
    drop(item: IDragItem) {
      // Don't replace items with themselves
      if (path.join('.') === item.path.join('.')) {
        return;
      }

      moveLayer(item.path, path);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

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
