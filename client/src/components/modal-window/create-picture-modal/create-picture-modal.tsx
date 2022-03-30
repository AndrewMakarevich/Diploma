import CreatePictureForm from "../../forms/picture-forms/create-picture-form";
import ModalWindow from "../modal-window";
import modalStyles from "./create-picture-modal.module.css";

const CreatePictureModal = ({ isOpen, setIsOpen }:
  { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  return (
    <ModalWindow id={modalStyles["modal-window"]} isOpen={isOpen} setIsOpen={setIsOpen}>
      <>
        <p>Create picture modal</p>
        <CreatePictureForm />
      </>
    </ModalWindow>
  )
};

export default CreatePictureModal;