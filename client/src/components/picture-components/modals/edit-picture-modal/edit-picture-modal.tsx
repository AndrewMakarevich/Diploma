import { useEffect, useState } from "react";
import { IExtendedPictureObj } from "../../../../interfaces/http/response/pictureInterfaces";
import PictureService from "../../../../services/picture-service";
import ModalWindow from "../../../modal-window/modal-window";

interface IEditPictureModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  currentPictureId: number
}

const EditPictureModal = ({ isOpen, setIsOpen, currentPictureId }: IEditPictureModalProps) => {
  const [pictureInfo, setPictureInfo] = useState<IExtendedPictureObj>();

  useEffect(() => {
    if (currentPictureId) {
      PictureService.getPicture(currentPictureId).then(({ data }) => setPictureInfo(data));
    }
  }, [currentPictureId]);
  return (
    <ModalWindow isOpen={isOpen} setIsOpen={setIsOpen}>
      <>
        Edit picture modal
        {pictureInfo && JSON.stringify(pictureInfo)}
      </>
    </ModalWindow>
  )
};

export default EditPictureModal;