import { useState } from "react";
import PictureList from "../lists/picture-lists/picture-list";
import CreatePictureModal from "../modal-window/create-picture-modal/create-picture-modal";

const MyGallery = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <article>
      <h1>Pictures gallery</h1>
      <PictureList />
      <button onClick={() => setIsOpen(true)}>create picture</button>
      <CreatePictureModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </article>
  )
};
export default MyGallery;