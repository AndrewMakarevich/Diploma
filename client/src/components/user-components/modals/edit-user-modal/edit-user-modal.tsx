import modalStyles from "./edit-user-modal.module.css";
import EditUserForm from "../../forms/edit-user-form/edit-user-form";
import ModalWindow from "../../../modal-window/modal-window";
import ResetPassForm from "../../forms/reset-pass-form/reset-pass-form";

const EditUserModal = ({ isOpen, setIsOpen }:
  { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <ModalWindow
      id={modalStyles["modal-window"]}
      isOpen={isOpen}
      setIsOpen={setIsOpen} >
      <>
        <EditUserForm />
        <ResetPassForm />
      </>
    </ModalWindow>
  )
};
export default EditUserModal;