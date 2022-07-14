import { useEffect, useRef, useState } from "react";
import popupStyles from "./side-popup.module.css";

interface ISidePopupProps {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  children: JSX.Element | JSX.Element[] | string,
  /** Should popup be closed finally, if true all states of children components will be deleted. Standart value "true" */
  finallyClose?: boolean,
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void,
  className?: string
}

const SidePopup = ({ isOpen, setIsOpen, children, finallyClose = true, onClick, className }: ISidePopupProps) => {
  const [popupState, setPopupState] = useState(false);
  const asidePopupRef = useRef<HTMLDivElement>(null);

  const asidePopupClassName = `${className || ""} ${popupStyles["aside-popup"]} ${!isOpen ? popupStyles["aside-popup-disabled"] : ""}`

  useEffect(() => {
    if (!finallyClose) {
      return;
    }

    if (!isOpen) {
      setTimeout(() => {
        setPopupState(isOpen)
      }, 300);
      return
    };

    setPopupState(isOpen)
  }, [isOpen]);

  if (finallyClose && !popupState) {
    return null;
  }

  return (
    <div onClick={onClick} ref={asidePopupRef} className={asidePopupClassName}>
      {children}
    </div>
  )
};

export default SidePopup;