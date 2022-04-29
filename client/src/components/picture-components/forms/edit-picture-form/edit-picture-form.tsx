import formStyles from "./edit-picture-form.module.css";
import { useEffect, useRef, useState } from "react";
import PictureService from "../../../../services/picture-service";
import returnPictureLink from "../../../../utils/img-utils/return-picture-link";
import ArrowIcon from "../../../../assets/img/icons/arrow-icon/arrow-icon";
import setFileInputCurrentImg from "../../../../utils/file-input-utils/setFileInputCurrentImg";
import { IEditedPictureMainDataEditForm, IPictureMainDataEditForm } from "../../../../interfaces/forms/edit-picture-interfaces";
import SectionList from "./section-list/section-list";
import StandartButton from "../../../../UI/standart-button/standart-button";
import TagList from "./tag-list/tag-list";
import { AxiosError } from "axios";
import PicturesTypesSelect from "../../inputs/pictures-types-select/pictures-types-select";
import DeleteButton from "../../../../UI/delete-button/delete-button";
import { IExtendedPictureObj } from "../../../../interfaces/http/response/pictureInterfaces";


export interface sectionObj {
  [key: string]: any,
  id: number,
  title: string,
  description: string,
  alreadyExists?: boolean,
  toDelete?: boolean
}

export interface tagObj {
  [key: string]: any,
  id: number,
  text: string,
  alreadyExists?: boolean,
  toDelete?: boolean
}

interface IEditPictureFormProps {
  pictureId: number
}

const EditPictureForm = ({ pictureId }: IEditPictureFormProps) => {
  const [mainPictureInfo, setMainPictureInfo] = useState<IPictureMainDataEditForm>({
    img: null,
    mainTitle: "",
    description: "",
    pictureTypeId: null
  });
  const [editedPictureInfo, setEditedPictureInfo] = useState<IEditedPictureMainDataEditForm>({
    img: null,
    mainTitle: "",
    description: "",
    pictureTypeId: ""
  });

  const [pictureSections, setPictureSections] = useState<sectionObj[]>([]);
  const [editedPictureSections, setEditedPictureSections] = useState<sectionObj[]>([]);

  const [pictureTags, setPictureTags] = useState<tagObj[]>([]);
  const [editedPictureTags, setEditedPictureTags] = useState<tagObj[]>([]);

  const [infoSectionOpen, setInfoSectionOpen] = useState(true);

  const inputImageRef = useRef<HTMLImageElement>(null);

  const setCurrentImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPictureInfo({ ...editedPictureInfo, img: e.target.files?.[0] });
    setFileInputCurrentImg(inputImageRef, e.target.files?.[0], returnPictureLink(mainPictureInfo?.img));
  };

  const groupAndSendData = async () => {
    const formData = new FormData();

    const mainInfoToEdit: { [key: string]: any } = {};

    for (let key in editedPictureInfo) {
      if (editedPictureInfo[key] !== mainPictureInfo[key]) {
        mainInfoToEdit[key] = editedPictureInfo[key];
      }
    }

    for (let key in mainInfoToEdit) {
      formData.append(key, mainInfoToEdit[key])
    }

    let filteredPictureSections = editedPictureSections;
    let pictureSectionsToDelete: number[] = [];

    let pictureSectionsToSend = editedPictureSections.map(section => {
      if (section.toDelete) {
        pictureSectionsToDelete.push(section.id);
        return;
      }

      const sameSection = pictureSections.find((el) => +el.id === +section.id);

      if (!sameSection) {
        if (section.title.split(' ').join('') && section.description.split(' ').join('')) {
          return section;
        }
        filteredPictureSections = filteredPictureSections.filter(editedSection => +editedSection.id !== +section.id)
        return undefined;
      };

      const editSectionObj: { [key: string]: any } = {};

      for (let sectionKey in section) {
        if (sectionKey === 'alreadyExists') {
          continue;
        }

        if (section[sectionKey] !== sameSection?.[sectionKey]) {
          editSectionObj[sectionKey] = section[sectionKey];
        }
      }

      if (Object.values(editSectionObj).length) {
        delete editSectionObj.alreadyExists;
        editSectionObj.id = section.id
        return editSectionObj;
      }
    });

    pictureSectionsToSend = pictureSectionsToSend.filter(section => section !== undefined)
    formData.append("pictureInfos", JSON.stringify(pictureSectionsToSend));

    let filteredPictureTags = editedPictureTags;
    let pictureTagsToDelete: number[] = [];

    let pictureTagsToSend = editedPictureTags.map(tag => {
      if (tag.toDelete) {
        pictureTagsToDelete.push(tag.id);
        return;
      }
      const sameTag = pictureTags.find(tagObj => +tagObj.id === +tag.id);

      if (!sameTag) {
        if (tag.text.split(" ").join("")) {
          return tag;
        }
        filteredPictureTags = filteredPictureTags.filter(editedTag => +editedTag.id !== +tag.id);
        return undefined;
      }

      const tagObject: { [key: string]: any } = {}

      for (let key in tag) {
        if (key === 'alreadyExists') {
          continue;
        }

        if (tag[key] !== sameTag?.[key]) {
          tagObject[key] = tag[key]
        }
      }

      if (Object.values(tagObject).length) {
        tagObject.id = tag.id;
        return tagObject;
      }
    });

    pictureTagsToSend = pictureTagsToSend.filter(tag => tag !== undefined);
    formData.append("pictureTags", JSON.stringify(pictureTagsToSend));

    if (!Object.values(mainInfoToEdit).length && !pictureSectionsToSend.length && !pictureTagsToSend.length) {
      console.log(pictureSectionsToDelete, pictureTagsToDelete);
      alert("Nothing to change");
      return;
    }

    console.log(mainInfoToEdit, pictureSectionsToSend, pictureTagsToSend)

    try {
      if (window.confirm("Are you sure you want to submit changes?")) {
        const response = await PictureService.editPicture(pictureId, formData);
        setPictureParams(response.data.picture);
      }

    } catch (e: Error | AxiosError | any) {
      if (e.isAxiosError) {
        alert(e.response.data.message);
        return;
      }

      alert(e.message);
    }

  };

  const clearAllChanges = async () => {
    if (window.confirm("Are you sure you want to clear all changes?")) {
      setEditedPictureInfo(mainPictureInfo);
      setEditedPictureSections(pictureSections.map(section => ({ ...section, alreadyExists: true })));
      setEditedPictureTags(pictureTags.map(tag => ({ ...tag, alreadyExists: true })));
    }
  }

  const setPictureParams = (data: IExtendedPictureObj) => {
    const mainInfo = {
      img: data.img,
      mainTitle: data.mainTitle,
      description: data.description,
      pictureTypeId: data.pictureTypeId
    }
    setMainPictureInfo(mainInfo);
    setEditedPictureInfo(mainInfo);

    setPictureSections(data.pictureInfos);
    setEditedPictureSections(data.pictureInfos.map(info => ({ ...info, alreadyExists: true })));

    setPictureTags(data.tags);
    setEditedPictureTags(data.tags.map(tag => ({ ...tag, alreadyExists: true })));
  };

  useEffect(() => {
    if (pictureId) {
      PictureService.getPicture(pictureId)
        .then(({ data }) => setPictureParams(data));
    }
  }, [pictureId]);

  return (
    <form>
      <section className={formStyles["img-section"]}>
        <label className={formStyles["img-input-label"]}>
          <input
            className={formStyles["img-input"]}
            type="file"
            accept='image/jpeg, image/jpg, image/png, image/webm'
            onChange={setCurrentImg}></input>
          <img
            ref={inputImageRef}
            className={formStyles["img"]}
            alt={editedPictureInfo?.mainTitle}
            src={returnPictureLink(String(editedPictureInfo?.img))}></img>
          <span className={formStyles["img-span"]}>Choose another image</span>
        </label>


      </section >

      <section className={`${formStyles["info-section"]} ${infoSectionOpen ? "" : formStyles["closed"]}`}>
        <button className={formStyles["close-info-section-btn"]}
          onClick={(e) => {
            e.preventDefault();
            setInfoSectionOpen(!infoSectionOpen);
          }}
        >
          <ArrowIcon id={formStyles["close-icon"]} />
        </button>
        <div className={formStyles["info-wrapper"]}>
          <PicturesTypesSelect value={editedPictureInfo.pictureTypeId || ""} onChange={(e) => setEditedPictureInfo({ ...editedPictureInfo, pictureTypeId: e.target.value })} />
          <div className={formStyles["main-info"]}>
            <fieldset>
              <legend>Main info</legend>
              <textarea
                value={editedPictureInfo?.mainTitle}
                onChange={(e) => setEditedPictureInfo({ ...editedPictureInfo, mainTitle: e.target.value })} />
              <textarea
                value={editedPictureInfo?.description}
                onChange={(e) => setEditedPictureInfo({ ...editedPictureInfo, description: e.target.value })} />
            </fieldset>

          </div>

          <div>
            <SectionList
              pictureId={pictureId}
              initialSectionsArr={pictureSections}
              setInitialSectionsArr={setPictureSections}
              setSectionsArr={setEditedPictureSections}
              sectionsArr={editedPictureSections} />
          </div>

          <p>Tags:</p>

          <TagList
            pictureId={pictureId}
            tagsArr={editedPictureTags}
            setTagsArr={setEditedPictureTags}
            initialTagsArr={pictureTags}
            setInitialTagsArr={setPictureTags} />

          <DeleteButton type="button" onClick={clearAllChanges}>Clear changes</DeleteButton>

          <StandartButton type="submit" onClick={(e) => {
            e.preventDefault();
            groupAndSendData();
          }}
          >Submit changes</StandartButton>
        </div>
      </section>
    </form >
  )
};

export default EditPictureForm;