import modalStyles from "./view-picture-modal.module.css";

import { useEffect, useState } from "react";
import { IExtendedPictureObj } from "../../../interfaces/http/response/pictureInterfaces";
import PictureService from "../../../services/picture-service";
import ModalWindow from "../modal-window";
import ArrowIcon from "../../../assets/img/icons/arrow-icon/arrow-icon";

interface IViewPictureModalProps {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  currentPictureId: number,
}


const ViewPictureModal = ({ isOpen, setIsOpen, currentPictureId }: IViewPictureModalProps) => {
  const [pictureInfo, setPictureInfo] = useState<IExtendedPictureObj | null>(null);
  const [pictureInfoIsOpen, setPictureInfoIsOpen] = useState(true);
  const currentPictureImgLink = process.env.REACT_APP_BACK_LINK + "/img/picture/" + pictureInfo?.img;
  const userImgLink = process.env.REACT_APP_BACK_LINK + "/img/avatar/" + pictureInfo?.user.avatar;
  const pictureDateCreation = new Date(pictureInfo?.createdAt || 0).toLocaleDateString("en-EN", { year: "numeric", month: "long", day: "numeric" });

  useEffect(() => {
    if (currentPictureId) {
      PictureService.getPicture(currentPictureId).then(({ data }) => setPictureInfo(data));
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
                    <p className={modalStyles["author-info-fullname"]}>{pictureDateCreation}</p>
                  </div>
                  <img className={modalStyles["author-avatar"]} alt={`${pictureInfo.user.nickname}'s avatar`} src={userImgLink}></img>
                </section>
                <hr></hr>
                <section className={modalStyles["main-info-block"]}>
                  <p className={modalStyles["main-title"]}>{pictureInfo.mainTitle}</p>
                  <div className={modalStyles["main-description__wrapper"]}>
                    <div className={modalStyles["main-description"]}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aliquam tempora possimus eos, aperiam sint ea vitae laudantium eius beatae magnam provident id quasi dolore, ex earum officia nemo quia!Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aliquam tempora possimus eos, aperiam sint ea vitae laudantium eius beatae magnam provident id quasi dolore, ex earum officia nemo quia!
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aliquam tempora possimus eos, aperiam sint ea vitae laudantium eius beatae magnam provident id quasi dolore, ex earum officia nemo quia!
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aliquam tempora possimus eos, aperiam sint ea vitae laudantium eius beatae magnam provident id quasi dolore, ex earum officia nemo quia!
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aliquam tempora possimus eos, aperiam sint ea vitae laudantium eius beatae magnam provident id quasi dolore, ex earum officia nemo quia!
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aliquam tempora possimus eos, aperiam sint ea vitae laudantium eius beatae magnam provident id quasi dolore, ex earum officia nemo quia!
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aliquam tempora possimus eos, aperiam sint ea vitae laudantium eius beatae magnam provident id quasi dolore, ex earum officia nemo quia!
                    </div>
                  </div>

                  <ul>
                    {
                      pictureInfo.pictureInfos.map(pictureInfo => (
                        <li>
                          <p>{pictureInfo.title}</p>
                          <p>{pictureInfo.description}</p>
                          <p>{pictureInfo.updatedAt}</p>
                        </li>
                      ))
                    }
                  </ul>
                  <ul>
                    {
                      pictureInfo.tags.map(tag => (
                        <li>
                          {tag.text}
                        </li>
                      ))
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