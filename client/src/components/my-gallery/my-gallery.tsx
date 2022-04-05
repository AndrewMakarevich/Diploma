import { useContext, useState } from "react";
import { Context } from "../..";
import PictureList from "../lists/picture-lists/picture-list/picture-list";
import CreatePictureModal from "../modal-window/create-picture-modal/create-picture-modal";

const MyGallery = () => {
  const { userStore } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <article>
      <h1>Pictures gallery</h1>
      <button onClick={() => setIsOpen(true)}>create picture</button>
      <CreatePictureModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <PictureList userId={userStore.userData.id} />
    </article>
  )
};
export default MyGallery;