import itemStyles from "./picture-item.module.css";
import { IShortPictureObj } from "../../../../../interfaces/http/response/pictureInterfaces";
import LikeIcon from "../../../../../assets/img/icons/like-icon/like-icon";

interface IPictureItemProps {
  pictureItem: IShortPictureObj
}

const PictureItem = ({ pictureItem }: IPictureItemProps) => {
  const pictureImgLink = process.env.REACT_APP_BACK_LINK + "/img/picture/" + pictureItem.img;
  return (
    <section className={itemStyles["wrapper"]}>
      <button className={itemStyles["open-picture__btn"]}></button>
      <img className={itemStyles["image"]} alt="" src={pictureImgLink} />
      <div className={itemStyles["picture-info"]}>
        <p className={itemStyles["author-nickname"]}>{pictureItem.user.nickname}</p>
        <div className={itemStyles["picture-info__sec-line"]}>
          <p className={itemStyles["picture-name"]}>{pictureItem.mainTitle}</p>
          <p className={itemStyles["picture-likes"]}><LikeIcon active={true} />{pictureItem.likesAmount}</p>
        </div>

      </div>

    </section>
  )
};

export default PictureItem;