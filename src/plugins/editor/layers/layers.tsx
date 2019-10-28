import update from 'immutability-helper';
import React, { useCallback, useRef, useState } from 'react';
import { DndProvider, DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { LayersIcon } from '../../../components/icons';
import { IPluginInterface } from '../../../components/plugins/plugins';

import panelStyles from '../../../layouts/panel.module.scss';
import styles from './layers.module.scss';

const style = {
  width: '100%',
};

const style2 = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

interface CardProps {
  id: any;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const Card: React.FC<CardProps> = ({ id, text, index, moveCard }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'card',
    // hover(item: DragItem, monitor: DropTargetMonitor) {
    //   if (!ref.current) {
    //     return;
    //   }
    //   const dragIndex = item.index;
    //   const hoverIndex = index;

    //   // Don't replace items with themselves
    //   if (dragIndex === hoverIndex) {
    //     return;
    //   }

    //   // Determine rectangle on screen
    //   const hoverBoundingRect = ref.current!.getBoundingClientRect();

    //   // Get vertical middle
    //   const hoverMiddleY =
    //     (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    //   // Determine mouse position
    //   const clientOffset = monitor.getClientOffset();

    //   // Get pixels to the top
    //   const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

    //   // Only perform the move when the mouse has crossed half of the items height
    //   // When dragging downwards, only move when the cursor is below 50%
    //   // When dragging upwards, only move when the cursor is above 50%

    //   // Dragging downwards
    //   if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //     return;
    //   }

    //   // Dragging upwards
    //   if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //     return;
    //   }

    //   // Time to actually perform the action
    //   // moveCard(dragIndex, hoverIndex);

    //   // Note: we're mutating the monitor item here!
    //   // Generally it's better to avoid mutations,
    //   // but it's good here for the sake of performance
    //   // to avoid expensive index searches.
    //   item.index = hoverIndex;
    // },
    drop(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current!.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ ...style2, opacity }}>
      {text}
    </div>
  );
};

const Container: React.FC = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        text: 'Write a cool JS library',
      },
      {
        id: 2,
        text: 'Make it generic enough',
      },
      {
        id: 3,
        text: 'Write README',
      },
      {
        id: 4,
        text: 'Create some examples',
      },
      {
        id: 5,
        text:
          'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
      },
      {
        id: 6,
        text: '???',
      },
      {
        id: 7,
        text: 'PROFIT',
      },
    ]);

    const moveCard = useCallback(
      (dragIndex: number, hoverIndex: number) => {
        const dragCard = cards[dragIndex];
        setCards(
          update(cards, {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
          }),
        );
      },
      [cards],
    );

    const renderCard = (card: { id: number; text: string }, index: number) => {
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
        />
      );
    };

    return (
      <>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    );
  }
};

const Menu: React.FC = () => {
  return (
    <LayersIcon className={panelStyles.menuIcon} />
  );
};

const LeftPanel: React.FC = () => {
  // const params = useParams<{ id: string }>();

  return (
    <div className={styles.wrapper}>
      <div>
        <DndProvider backend={HTML5Backend}>
          <Container />
        </DndProvider>
        <ul className={styles.layers}>
          <li className={styles.layer}>
            <div>
              layer
            </div>
          </li>
        </ul>
      </div>
      Hello left side
    </div>
  );
};

const plugin: IPluginInterface = {
  'editor.panel.menu': {
    action: 'layers',
    render: Menu,
  },
  'editor.panel.left': {
    action: 'layers',
    render: LeftPanel,
  },
};

export = plugin;
