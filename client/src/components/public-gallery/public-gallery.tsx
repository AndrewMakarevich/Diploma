import PictureList from "../lists/picture-lists/picture-list/picture-list";
import galleryStyles from "./public-gallery.module.css";

const PublicGallery = () => {
  return (
    <article>
      Public gallery
      <PictureList userId={0} isPersonalGallery={false} />
    </article>
  )
};

export default PublicGallery;