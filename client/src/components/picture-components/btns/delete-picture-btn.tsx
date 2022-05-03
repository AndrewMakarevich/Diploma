import { AxiosError } from "axios"
import { useContext } from "react"
import { Context } from "../../.."
import PictureService from "../../../services/picture-service"
import DeleteButton from "../../../UI/delete-button/delete-button"

interface IDeleteButtonProps {
  pictureId: number,
  pictureMainTitle: string,
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  className?: string
}

const DeletePictureBtn = ({ pictureId, pictureMainTitle, setModalIsOpen, className }: IDeleteButtonProps) => {
  const { pictureStore } = useContext(Context);
  const confirmAndDeletePicture = async () => {
    const promptString = `Enter picture main title "${pictureMainTitle}" to confirm its deleting`
    if (window.prompt(promptString) === pictureMainTitle) {
      try {
        const response = await PictureService.deletePicture(pictureId);
        alert(response.data.message);
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
    <DeleteButton type="button" onClick={confirmAndDeletePicture} className={className}>
      Delete picture
    </DeleteButton>
  )
}

export default DeletePictureBtn;