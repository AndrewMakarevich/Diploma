import modalStyles from "./edit-user-modal.module.css";
import EditUserForm from "../../forms/edit-user-form/edit-user-form";
import ModalWindow from "../modal-window";

const EditUserModal = ({ isOpen, setIsOpen }:
  { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <ModalWindow
      id={modalStyles["modal-window"]}
      closeBtnId={modalStyles["close-btn"]}
      isOpen={isOpen}
      setIsOpen={setIsOpen} >
      <EditUserForm />
    </ModalWindow>
  )
};
export default EditUserModal;