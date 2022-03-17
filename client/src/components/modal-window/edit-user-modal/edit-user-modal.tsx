
import EditUserForm from "../../forms/edit-user-form/edit-user-form";
import ModalWindow from "../modal-window";

const EditUserModal = ({ isOpen, setIsOpen }:
  { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <ModalWindow isOpen={isOpen} setIsOpen={setIsOpen} >
      <EditUserForm />
    </ModalWindow>
  )
};
export default EditUserModal;