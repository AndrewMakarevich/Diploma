import React, { useEffect } from 'react';
import modalStyles from './modal-window.module.css';

const ModalWindow = ({ id, closeBtnId, children, isOpen, setIsOpen }:
  { id?: string, closeBtnId?: string, children?: JSX.Element | string, isOpen?: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {


  useEffect(() => {
    const closeModalByEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keyup", closeModalByEsc);

    return () => document.removeEventListener("keyup", closeModalByEsc);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={modalStyles['modal-wrapper']} onClick={() => {
      if (setIsOpen) {
        setIsOpen(false)
      }
    }
    }>
      <div id={id} className={modalStyles['modal-window']} onClick={(e) => e.stopPropagation()}>
        <button id={closeBtnId} className={modalStyles['close-modal__btn']}
          onClick={() => {
            if (setIsOpen) {
              setIsOpen(false)
            }
          }}>&#215;</button>
        <div className={modalStyles['modal-window__content']}>
          {children}
        </div>
      </div>
    </div>
  )
};
export default ModalWindow;