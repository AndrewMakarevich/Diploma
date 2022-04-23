import PictureList from "../picture-components/picture-list/picture-list";
import galleryStyles from "./public-gallery.module.css";

interface IPublicGallryProps {
  userId?: number
}

const PublicGallery = ({ userId = 0 }: IPublicGallryProps) => {
  return (
    <article>
      Public gallery
      <PictureList userId={userId} isPersonalGallery={false} />
    </article>
  )
};

export default PublicGallery;