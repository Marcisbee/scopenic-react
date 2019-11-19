import React from 'react';

import { useLockBodyScroll } from '../../hooks/use-lock-body-scroll';
import ModalPortal from '../modal-portal';

import styles from './form-modal.module.scss';

interface IFormModalProps {
  close: () => void;
  width?: number;
}

const FormModal: React.FC<IFormModalProps> = ({ width, close, children }) => {
  useLockBodyScroll();

  return (
    <ModalPortal>
      <div className={styles.wrapper} onClick={close}>
        <div className={styles.modal} style={{ width }} onClick={(e) => e.stopPropagation()}>
          <div>
            {children}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default FormModal;
