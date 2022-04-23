import { useCallback } from "react";
import { IExtendedPictureObj } from "../../../interfaces/http/response/pictureInterfaces";
import listStyles from "./picture-info-list.module.css";

interface IPictureInfoListProps {
  pictureInfos: IExtendedPictureObj["pictureInfos"]
}

const PictureInfoList = ({ pictureInfos }: IPictureInfoListProps) => {
  const getParsedDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString("en-EN", { year: 'numeric', month: "long", day: "numeric" });
  }, []);

  return (
    <ul className={listStyles["picture-info__list"]}>
      {
        pictureInfos.map(pictureInfo => (
          <li key={pictureInfo.id} className={listStyles["picture-info__item"]}>
            <p className={listStyles["picture-info__item-title"]}>
              {pictureInfo.title}
            </p>
            <hr></hr>
            <p className={listStyles["picture-info__item-description"]}>
              {pictureInfo.description}
            </p>
            <p className={listStyles["picture-info__item-creation-date"]}>
              Section created at: {getParsedDate(pictureInfo.createdAt)}
            </p>
            <p className={listStyles["picture-info__item-update-date"]}>
              {pictureInfo.createdAt === pictureInfo.updatedAt ? "" : `Last update: ${getParsedDate(pictureInfo.updatedAt)}`}
            </p>
          </li>
        ))
      }
    </ul>
  )
};

export default PictureInfoList;