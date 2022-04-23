import React, { useCallback, useEffect, useRef } from 'react';
import modalStyles from './modal-window.module.css';

interface IModalWindow {
  id?: string,
  closeBtnId?: string,
  children: JSX.Element | string,
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalWindow = ({ id, closeBtnId, children, isOpen, setIsOpen }: IModalWindow) => {
  const closeModalBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null)

  const closeModalByEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const focusTrap = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (e.target === lastFocusableElementRef.current) {
        e.preventDefault();
        closeModalBtnRef.current!.focus();
      }
    }
  }

  const skipEmptyBtn = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (e.target === lastFocusableElementRef.current) {
        e.preventDefault();
        closeModalBtnRef.current!.focus();
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      closeModalBtnRef.current?.focus();
      document.addEventListener("keydown", focusTrap);
      document.addEventListener("keyup", skipEmptyBtn);
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

  return (
    <div className={modalStyles['modal-wrapper']} onClick={() => {
      if (setIsOpen) {
        setIsOpen(false)
      }
    }
    }>
      <div id={id} className={modalStyles['modal-window']} onClick={(e) => e.stopPropagation()}>
        <button ref={closeModalBtnRef} id={closeBtnId} className={modalStyles['close-modal__btn']}
          onClick={() => {
            if (setIsOpen) {
              setIsOpen(false)
            }
          }}>&#215;</button>
        <div className={modalStyles['modal-window__content']}>
          {children}
        </div>
      </div>
      <button className={modalStyles['last-modal-focusable-el']} ref={lastFocusableElementRef}></button>
    </div>
  )
};
export default ModalWindow;