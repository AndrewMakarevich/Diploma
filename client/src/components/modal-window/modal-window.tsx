import React from 'react';
import modalStyles from './modal-window.module.css';

const ModalWindow = ({ id, closeBtnId, children, isOpen, setIsOpen }:
  { id?: string, closeBtnId?: string, children?: JSX.Element | string, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  if (!isOpen) {
    return null;
  }

  return (
    <div className={modalStyles['modal-wrapper']} onClick={() => setIsOpen(false)}>
      <div id={id} className={modalStyles['modal-window']} onClick={(e) => e.stopPropagation()}>
        <button id={closeBtnId} className={modalStyles['close-modal__btn']} onClick={() => setIsOpen(false)}>&#215;</button>
        <div className={modalStyles['modal-window__content']}>
          {children}
        </div>
      </div>
    </div>
  )
};
export default ModalWindow;