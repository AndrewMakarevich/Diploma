import modalStyles from "./edit-picture-modal.module.css";
import ModalWindow from "../../../modal-window/modal-window";
import EditPictureForm from "../../forms/edit-picture-form/edit-picture-form";

interface IEditPictureModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  currentPictureId: number
}

const EditPictureModal = ({ isOpen, setIsOpen, currentPictureId }: IEditPictureModalProps) => {
  return (
    <ModalWindow closeBtnId={modalStyles["close-btn"]} isOpen={isOpen} setIsOpen={setIsOpen} modalWindowContentClassName={modalStyles["edit-picture-modal-content"]}>
      <EditPictureForm pictureId={currentPictureId} setModalIsOpen={setIsOpen} />
    </ModalWindow>
  )
};

export default EditPictureModal;