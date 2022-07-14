import SidePopup from "../../side-popup/side-popup";
import NotificationsList from "../notifications-list/notifications-list";

interface IPopupProps {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

const RecievedNotificationsPopup = ({ isOpen, setIsOpen, onClick }: IPopupProps) => {

  return (
    <SidePopup onClick={onClick} isOpen={isOpen} setIsOpen={setIsOpen} finallyClose={false}>
      <NotificationsList />
    </SidePopup>
  )
};

export default RecievedNotificationsPopup;