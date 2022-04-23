import modalStyles from "./view-picture-modal.module.css";

import { useCallback, useContext, useEffect, useState } from "react";
import { IExtendedPictureObj } from "../../../../interfaces/http/response/pictureInterfaces";
import PictureService from "../../../../services/picture-service";
import ModalWindow from "../../../modal-window/modal-window";
import ArrowIcon from "../../../../assets/img/icons/arrow-icon/arrow-icon";
import { Context } from "../../../..";
import LikeEssenceBtn from "../../../btns/like-essence-btn/like-essence-btn";
import { IGetPictureLikesResponseObj } from "../../../../interfaces/http/response/pictureLikeInterfaces";
import PictureLikeService from "../../../../services/picture-like-service";
import PictureInfoList from "../../picture-info-list/picture-info-list";
import PictureCommentList from "../../../lists/comment-list/comment-list";
import { runInAction } from "mobx";
import { Link } from "react-router-dom";
import { routePaths } from "../../../routes/paths";
import returnUserAvatar from "../../../../utils/img-utils/return-user-avatar";

interface IViewPictureModalProps {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  currentPictureId: number,
}


const ViewPictureModal = ({ isOpen, setIsOpen, currentPictureId }: IViewPictureModalProps) => {
  const { userStore, pictureStore } = useContext(Context);
  const [pictureInfo, setPictureInfo] = useState<IExtendedPictureObj | null>(null);
  const [pictureLikes, setPictureLikes] = useState<IGetPictureLikesResponseObj[]>([]);
  const [pictureInfoIsOpen, setPictureInfoIsOpen] = useState(true);


  const currentPictureImgLink = process.env.REACT_APP_BACK_LINK + "/img/picture/" + pictureInfo?.img;

  const getParsedDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString("en-EN", { year: 'numeric', month: "long", day: "numeric" });
  }, []);

  function getLikes() {
    PictureLikeService.getPictureLikes(currentPictureId).then(({ data }) => setPictureLikes(data));
  };

  function getPictureInfo() {
    PictureService.getPicture(currentPictureId).then(({ data }) => setPictureInfo(data));
  }


  useEffect(() => {
    if (currentPictureId) {
      getPictureInfo();
      getLikes();
    }
  }, [currentPictureId]);

  return (
    <ModalWindow isOpen={isOpen} setIsOpen={setIsOpen} closeBtnId={modalStyles["close-btn"]}>
      {
        pictureInfo ?
          <section className={modalStyles["wrapper"]}>
            <div className={modalStyles["picture-img-block"]}>
              <img
                className={modalStyles["img"]}
                alt={pictureInfo.mainTitle}
                src={currentPictureImgLink} />
            </div>

            <div className={modalStyles["picture-like-block"]}>
              <LikeEssenceBtn
                sendLikeRequest={async () => {
                  await PictureLikeService.likePicture(pictureInfo.id)
                }}
                actualizeInfoAfterLike={() => getLikes()}
                active={pictureLikes.some((likeObj) => likeObj.userId === userStore.userData.id)} />
              <p>{pictureLikes?.length}</p>
            </div>

            <div className={`${modalStyles["picture-info-wrapper"]} ${pictureInfoIsOpen ? "" : modalStyles["closed-picture-info"]}`}>
              <button
                className={modalStyles["hide-picture-info-btn"]}
                onClick={(e) => setPictureInfoIsOpen(!pictureInfoIsOpen)}>
                <ArrowIcon id={modalStyles["arrow-icon"]} />
              </button>

              <div className={modalStyles["picture-info-block"]}>
                <section className={modalStyles["author-info-block"]}>
                  <div>
                    <p className={modalStyles["author-info-nickname"]}>{pictureInfo.user.nickname}</p>
                    <p className={modalStyles["author-info-fullname"]}>{pictureInfo.user.firstName} {pictureInfo.user.surname}</p>
                    <p className={modalStyles["author-info-fullname"]}>{getParsedDate(pictureInfo.createdAt)}</p>
                  </div>
                  <Link to={userStore.userData.id === pictureInfo.user.id ? routePaths.personalCabinet.main : `user/${pictureInfo.user.id}`}>
                    <img className={modalStyles["author-avatar"]} alt={`${pictureInfo.user.nickname}'s avatar`} src={returnUserAvatar(pictureInfo?.user.avatar)}></img>
                  </Link>

                </section>

                <hr></hr>

                <section className={modalStyles["main-info-block"]}>
                  <p className={modalStyles["main-title"]}>{pictureInfo.mainTitle}</p>

                  <div className={modalStyles["main-description__wrapper"]}>
                    <div className={`${pictureInfo.description ? modalStyles["main-description"] : ""}`}>
                      {pictureInfo.description}
                    </div>
                  </div>

                  <PictureInfoList pictureInfos={pictureInfo.pictureInfos} />

                  <p className={modalStyles["picture-tags__header"]}>Tags:</p>

                  <ul className={modalStyles["picture-tags__list"]}>
                    {pictureInfo.tags.map(tag => (
                      <button
                        onClick={(e) => {
                          runInAction(() => {
                            pictureStore.queryParams = { ...pictureStore.queryParams, queryString: `#${tag.text}`, page: 1 };
                            pictureStore.getPictures();
                          });
                        }}
                        key={tag.id}
                        className={modalStyles["picture-tags__item"]}>
                        {tag.text}
                      </button>
                    ))}
                  </ul>
                  <PictureCommentList pictureId={currentPictureId} pictureAuthorId={pictureInfo.userId} />
                </section>

              </div>

            </div>
          </section>
          :
          <p>Can't find picture's id, to send correct request to the server</p>
      }

    </ModalWindow>
  )
};

export default ViewPictureModal;