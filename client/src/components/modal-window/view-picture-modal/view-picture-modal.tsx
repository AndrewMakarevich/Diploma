import modalStyles from "./view-picture-modal.module.css";

import { useCallback, useContext, useEffect, useState } from "react";
import { IExtendedPictureObj } from "../../../interfaces/http/response/pictureInterfaces";
import PictureService from "../../../services/picture-service";
import ModalWindow from "../modal-window";
import ArrowIcon from "../../../assets/img/icons/arrow-icon/arrow-icon";
import LikeButton from "../../../UI/like-button/like-button";
import { Context } from "../../..";
import LikePictureBtn from "../../btns/like-picture-btn/like-picture-btn";
import { IGetPictureLikesResponseObj, IPictureLikeResponseObj } from "../../../interfaces/http/response/pictureLikeInterfaces";
import PictureLikeService from "../../../services/picture-like-service";
import { IGetPictureCommentsResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";
import GetPictureCommentsButton from "../../btns/get-picture-comments-btn/get-picture-comments-btn";

interface IViewPictureModalProps {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  currentPictureId: number,
}


const ViewPictureModal = ({ isOpen, setIsOpen, currentPictureId }: IViewPictureModalProps) => {
  const { userStore } = useContext(Context);
  const [pictureInfo, setPictureInfo] = useState<IExtendedPictureObj | null>(null);
  const [pictureLikes, setPictureLikes] = useState<IGetPictureLikesResponseObj[] | []>([]);
  const [pictureComments, setPictureComments] = useState<IGetPictureCommentsResponseObj[] | []>([])
  const [pictureInfoIsOpen, setPictureInfoIsOpen] = useState(true);


  const currentPictureImgLink = process.env.REACT_APP_BACK_LINK + "/img/picture/" + pictureInfo?.img;
  const userImgLink = process.env.REACT_APP_BACK_LINK + "/img/avatar/" + pictureInfo?.user.avatar;

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

  useEffect(() => {
    console.log(pictureLikes.some((likeObj) => likeObj.userId === userStore.userData.id));
    console.log(pictureLikes);
  }, [pictureLikes]);

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
              <LikePictureBtn
                pictureId={pictureInfo.id}
                actualizePictureLikes={() => getLikes()}
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
                  <img className={modalStyles["author-avatar"]} alt={`${pictureInfo.user.nickname}'s avatar`} src={userImgLink}></img>
                </section>
                <hr></hr>
                <section className={modalStyles["main-info-block"]}>
                  <p className={modalStyles["main-title"]}>{pictureInfo.mainTitle}</p>

                  <div className={modalStyles["main-description__wrapper"]}>
                    <div className={`${pictureInfo.description ? modalStyles["main-description"] : ""}`}>
                      {pictureInfo.description}
                    </div>
                  </div>

                  <ul className={modalStyles["picture-info__list"]}>
                    {
                      pictureInfo.pictureInfos.map(pictureInfo => (
                        <li className={modalStyles["picture-info__item"]}>
                          <p className={modalStyles["picture-info__item-title"]}>
                            {pictureInfo.title}
                            <hr></hr>
                          </p>
                          <p className={modalStyles["picture-info__item-description"]}>
                            {pictureInfo.description}
                          </p>
                          <p className={modalStyles["picture-info__item-creation-date"]}>
                            Section created at: {getParsedDate(pictureInfo.createdAt)}
                          </p>
                          <p className={modalStyles["picture-info__item-update-date"]}>
                            {pictureInfo.createdAt === pictureInfo.updatedAt ? "" : `Last update: ${getParsedDate(pictureInfo.updatedAt)}`}
                          </p>
                        </li>
                      ))
                    }
                  </ul>

                  <p className={modalStyles["picture-tags__header"]}>Tags:</p>
                  <ul className={modalStyles["picture-tags__list"]}>
                    {
                      pictureInfo.tags.map(tag => (
                        <li className={modalStyles["picture-tags__item"]}>
                          {tag.text}
                        </li>
                      ))
                    }
                  </ul>

                  <GetPictureCommentsButton pictureId={currentPictureId} commentId={0} setPictureComments={setPictureComments} >
                    Get comments
                  </GetPictureCommentsButton>

                  <ul>
                    {
                      pictureComments.map(comment =>
                        <li>{JSON.stringify(comment)}</li>
                      )
                    }
                  </ul>
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