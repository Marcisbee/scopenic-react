import React from 'react';
import ReactDOM from 'react-dom';

import { CloseIcon } from '../../components/icons';
import { useLockBodyScroll } from '../../hooks/use-lock-body-scroll';

import styles from './modal.module.scss';

const ModalNode = document.getElementById('modal');

const ModalPortal = ({ children }: any) => {
  if (!ModalNode) {
    return children;
  }

  return ReactDOM.createPortal(children, ModalNode);
};

interface IModalProps {
  title?: string;
  close: () => void;
  width?: number;
}

const Modal: React.FC<IModalProps> = ({ width, title, close, children }) => {
  useLockBodyScroll();

  return (
    <ModalPortal>
      <div className={styles.wrapper} onClick={close}>
        <div className={styles.modal} style={{ width }} onClick={(e) => e.stopPropagation()}>
          {title && (
            <div className={styles.header}>
              <div className="row">
                <div className="col-xs-10">
                  <h3>{title}</h3>
                </div>
                <div className="col-xs-2 text-right">
                  <button type="button" className={styles.close} onClick={close}>
                    <CloseIcon />
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default Modal;
