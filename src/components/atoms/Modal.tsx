import React, { FC, MouseEvent, useEffect, PropsWithChildren } from 'react';
import styles from './Modal.module.css';

interface Props extends PropsWithChildren {
  isOpen: boolean;
  closeModal: () => void;
  top?: number;
  right?: number;
}

const Modal: FC<Props> = ({ closeModal, isOpen, children, top, right }) => {
  const handleClickOutside: any = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return isOpen ? (
    <div className={styles.modalContainer} onClick={handleClickOutside}>
      <div
        className={styles.modalContent}
        style={{ top: top ?? undefined, right: right ?? undefined }}
      >
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;
