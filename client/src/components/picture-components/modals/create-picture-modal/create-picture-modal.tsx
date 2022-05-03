import CreatePictureForm from "../../forms/create-picture-form/create-picture-form";
import ModalWindow from "../../../modal-window/modal-window";
import modalStyles from "./create-picture-modal.module.css";

const CreatePictureModal = ({ isOpen, setIsOpen }:
  { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  return (
    <ModalWindow id={modalStyles["modal-window"]} isOpen={isOpen} setIsOpen={setIsOpen}>
      <CreatePictureForm setModalIsOpen={setIsOpen} />
    </ModalWindow>
  )
};

export default CreatePictureModal;