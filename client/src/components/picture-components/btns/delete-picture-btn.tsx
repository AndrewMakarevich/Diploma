import { AxiosError } from "axios"
import { useContext } from "react"
import { Context } from "../../.."
import PictureService from "../../../services/picture-service"
import DeleteButton from "../../../UI/delete-button/delete-button"

interface IDeleteButtonProps {
  pictureId: number,
  pictureMainTitle: string,
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  className?: string,
  disabled?: boolean,
  isOwnPicture: boolean
}

const DeletePictureBtn = ({ pictureId, pictureMainTitle, setModalIsOpen, className, isOwnPicture, disabled = false }: IDeleteButtonProps) => {
  const { pictureStore } = useContext(Context);
  const confirmAndDeletePicture = async () => {
    if (disabled) {
      return
    };

    const promptString = `Enter picture main title "${pictureMainTitle}" to confirm its deleting`

    if (window.prompt(promptString) === pictureMainTitle) {
      try {
        if (isOwnPicture) {
          const response = await PictureService.deleteOwnPicture(pictureId);
          alert(response.data.message);
        } else {
          const response = await PictureService.deleteElsesPicture(pictureId);
          alert(response.data.message);
        }

        await pictureStore.getPictures();
        setModalIsOpen(false);

      } catch (e: AxiosError | Error | any) {
        if (e.isAxiosError) {
          alert(e.respons.data.message);
          return;
        }
        alert(e.message)
      }
      return;
    }

    alert("Incorrect picture main title entered");
  }

  return (
    <DeleteButton type="button" disabled={disabled} onClick={confirmAndDeletePicture} className={className}>
      Delete picture
    </DeleteButton>
  )
}

export default DeletePictureBtn;