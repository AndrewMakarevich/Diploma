import { useContext, useState } from "react";
import articleStyles from "./my-gallery.module.css";
import { Context } from "../..";
import PictureList from "../picture-components/picture-list/picture-list";
import CreatePictureModal from "../picture-components/modals/create-picture-modal/create-picture-modal";
import ViewPictureModal from "../picture-components/modals/view-picture-modal/view-picture-modal";

const MyGallery = () => {
  const { userStore } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className={articleStyles["my-gallery-article"]}>
      <h1>Pictures gallery</h1>
      <button onClick={() => setIsOpen(true)}>create picture</button>
      <CreatePictureModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <PictureList userId={userStore.userData.id} isPersonalGallery={true} />
    </article>
  )
};
export default MyGallery;