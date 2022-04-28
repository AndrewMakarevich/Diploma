import modalStyles from "./edit-picture-modal.module.css";
import { useEffect, useState } from "react";
import { IExtendedPictureObj } from "../../../../interfaces/http/response/pictureInterfaces";
import PictureService from "../../../../services/picture-service";
import ModalWindow from "../../../modal-window/modal-window";
import EditPictureForm from "../../forms/edit-picture-form/edit-picture-form";

interface IEditPictureModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  currentPictureId: number
}

const EditPictureModal = ({ isOpen, setIsOpen, currentPictureId }: IEditPictureModalProps) => {
  return (
    <ModalWindow closeBtnId={modalStyles["close-btn"]} isOpen={isOpen} setIsOpen={setIsOpen}>
      <>
        <EditPictureForm pictureId={currentPictureId} />
      </>
    </ModalWindow>
  )
};

export default EditPictureModal;