import PictureList from "../picture-components/picture-list/picture-list";
import Slider from "../slider/slider";
import galleryStyles from "./public-gallery.module.css";

interface IPublicGallryProps {
  userId?: number
}

const PublicGallery = ({ userId = 0 }: IPublicGallryProps) => {
  return (
    <article className={galleryStyles["public-gallery-wrapper"]}>
      <Slider />
      <PictureList userId={userId} isPersonalGallery={false} />
    </article>
  )
};

export default PublicGallery;