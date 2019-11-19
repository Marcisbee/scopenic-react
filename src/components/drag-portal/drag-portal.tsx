import React from 'react';
import ReactDOM from 'react-dom';

import styles from './drag-portal.module.scss';

const DragNode = document.getElementById('modal');

const DragElement: React.FC = () => {
  return <span className={styles.element} />;
};

const DragPortalWrap: React.FC = () => {
  if (!DragNode) {
    return <DragElement />;
  }

  return ReactDOM.createPortal(<DragElement />, DragNode);
};

const DragPortal: React.FC = () => {
  const [showWrap, setShowWrap] = React.useState(false);

  return (
    <span
      className={styles.handle}
      onMouseDown={() => setShowWrap(true)}
      onMouseUp={() => setShowWrap(false)}
      onMouseLeave={() => setShowWrap(false)}
    >
      {showWrap && <DragPortalWrap />}
    </span>
  );
};

export default DragPortal;
