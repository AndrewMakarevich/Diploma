import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '../../assets/img/icons/close-icon/close-icon';
import modalStyles from './modal-window.module.css';

interface IModalWindow {
  id?: string,
  closeBtnId?: string,
  children: JSX.Element | string,
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  modalWindowContentClassName?: string
}

const ModalWindow = ({ id, closeBtnId, children, isOpen, setIsOpen, modalWindowContentClassName }: IModalWindow) => {
  const closeModalBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null)

  const closeModalByEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const focusTrap = (e: KeyboardEvent) => {
    if (e.key !== "Tab") {
      return;
    }

    if (e.shiftKey) {
      if (e.target === closeModalBtnRef.current) {
        lastFocusableElementRef.current!.focus();
      }
      return;
    }

    if (e.target === lastFocusableElementRef.current) {
      e.preventDefault();
      closeModalBtnRef.current!.focus();
    }
  }


  useEffect(() => {
    if (isOpen) {
      closeModalBtnRef.current?.focus();
      document.addEventListener("keydown", focusTrap);
      document.addEventListener("keyup", focusTrap);
      document.addEventListener("keyup", closeModalByEsc);
    } else {
      document.removeEventListener("keydown", focusTrap)
      document.removeEventListener("keyup", closeModalByEsc);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.removeEventListener("keyup", focusTrap)
      document.removeEventListener("keyup", closeModalByEsc);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  const modal = (
    <div className={modalStyles['modal-wrapper']} onClick={() => {
      if (setIsOpen) {
        setIsOpen(false)
      }
    }
    }>
      <div id={id} className={modalStyles['modal-window']} onClick={(e) => e.stopPropagation()}>
        <button ref={closeModalBtnRef} id={closeBtnId} className={modalStyles['close-modal__btn']}
          title="close modal"
          onClick={() => {
            if (setIsOpen) {
              setIsOpen(false)
            }
          }}><CloseIcon /></button>
        <div className={`${modalStyles['modal-window__content']} ${modalWindowContentClassName || ""}`}>
          {children}
        </div>
      </div>
      <button className={modalStyles['last-modal-focusable-el']} ref={lastFocusableElementRef}></button>
    </div>
  );

  return createPortal(modal, document.getElementById("root")!);
};
export default ModalWindow;