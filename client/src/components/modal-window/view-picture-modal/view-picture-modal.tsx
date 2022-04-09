import ModalWindow from "../modal-window";

interface IViewPictureModalProps {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  currentPictureId: number,
}

const ViewPictureModal = ({ isOpen, setIsOpen, currentPictureId }: IViewPictureModalProps) => {
  return (
    <ModalWindow isOpen={isOpen} setIsOpen={setIsOpen}>
      View picture modal
    </ModalWindow>
  )
};

export default ViewPictureModal;