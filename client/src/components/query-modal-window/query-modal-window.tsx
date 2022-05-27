import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Context } from '../..';
import modalStyles from './modal-window.module.css';
const QueryModalWindow = ({ stylesById, children, className }: { stylesById: string, children: JSX.Element, className?: string }) => {
  const { modalStore } = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();

  function closeModal() {
    modalStore.modalSearchParams.forEach(searchParam => {
      searchParams.delete(searchParam);
    });
    setSearchParams(searchParams);
  }

  const closeModalBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null)

  const closeModalByEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal()
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
    document.addEventListener("keydown", focusTrap);
    document.addEventListener("keyup", focusTrap);
    document.addEventListener("keyup", closeModalByEsc);

    return () => {
      document.removeEventListener("keydown", focusTrap);
      document.removeEventListener("keyup", focusTrap);
      document.removeEventListener("keyup", closeModalByEsc);
    }
  }, [])

  return (
    <div className={modalStyles['modal-wrapper']} onClick={(e) => {
      closeModal();
    }}>
      <div id={stylesById} className={`${modalStyles['modal-window']}`} onClick={(e) => e.stopPropagation()}>
        <button ref={closeModalBtnRef} className={modalStyles['close-modal__btn']} onClick={() => closeModal()}>&#215;</button>
        <section className={modalStyles['modal-window__content']}>
          {children}
        </section>
      </div>
      <button className={modalStyles['last-modal-focusable-el']} ref={lastFocusableElementRef}></button>
    </div>
  )
};
export default observer(QueryModalWindow);