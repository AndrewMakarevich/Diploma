import { useContext, useState } from "react";
import galleryStyles from "./my-gallery.module.css";
import { Context } from "../..";
import PictureList from "../picture-components/picture-list/picture-list";
import CreatePictureModal from "../picture-components/modals/create-picture-modal/create-picture-modal";

const MyGallery = () => {
  const { userStore } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className={galleryStyles["my-gallery-article"]}>
      <button className={galleryStyles["create-picture-btn"]} onClick={() => setIsOpen(true)}>Add new picture</button>
      <CreatePictureModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <PictureList userId={userStore.userData.id} isPersonalGallery={true} />
    </article>
  )
};
export default MyGallery;