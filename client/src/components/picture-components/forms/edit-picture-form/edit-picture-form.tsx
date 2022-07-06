import formStyles from "./edit-picture-form.module.css";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import PictureService from "../../../../services/picture-service";
import returnPictureLink from "../../../../utils/img-utils/return-picture-link";
import ArrowIcon from "../../../../assets/img/icons/arrow-icon/arrow-icon";
import setFileInputCurrentImg from "../../../../utils/file-input-utils/setFileInputCurrentImg";
import { IEditedPictureMainDataEditForm, IPictureMainDataEditForm } from "../../../../interfaces/forms/edit-picture-interfaces";
import SectionList from "./section-list/section-list";
import StandartButton from "../../../../UI/standart-button/standart-button";
import TagList from "./tag-list/tag-list";
import PicturesTypesSelect from "../../inputs/pictures-types-select/pictures-types-select";
import DeleteButton from "../../../../UI/delete-button/delete-button";
import { IExtendedPictureObj } from "../../../../interfaces/http/response/pictureInterfaces";
import PictureInfoService from "../../../../services/picture-info-service";
import PictureTagService from "../../../../services/picture-tag-service";
import DeletePictureBtn from "../../btns/delete-picture-btn";
import useFetching from "../../../../hooks/useFetching";
import { IEditPictureFormProps, sectionObj, tagObj } from "./interfaces";
import { Context } from "../../../..";
import { PictureValidator } from "../../../../validator/picture-validator";
import PictureTagValidator from "../../../../validator/picture-tag-validator";

const EditPictureForm = ({ pictureId, setModalIsOpen }: IEditPictureFormProps) => {
  const { pictureStore } = useContext(Context)
  const {
    executeCallback: getPictureInfo,
    isLoading: pictureLoading } =
    useFetching((pictureIdVal: number) => PictureService.getPicture(pictureIdVal));
  const [mainPictureInfo, setMainPictureInfo] = useState<IPictureMainDataEditForm>({
    img: null,
    mainTitle: "",
    description: "",
    pictureTypeId: null
  });
  const [editedMainPictureInfo, setEditedMainPictureInfo] = useState<IEditedPictureMainDataEditForm>({
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
    setEditedMainPictureInfo({ ...editedMainPictureInfo, img: e.target.files?.[0] });
    setFileInputCurrentImg(inputImageRef, e.target.files?.[0], returnPictureLink(mainPictureInfo?.img));
  };

  interface validationObject {
    [key: string]: Function
  }

  const validationMainInfoObject: validationObject = {
    "img": PictureValidator.checkLoadedPicture,
    "mainTitle": PictureValidator.checkMainTitle,
    "description": PictureValidator.checkMainDescription
  };

  const validationPictureInfoObject: validationObject = {
    "title": PictureValidator.checkAdditionalTitle,
    "description": PictureValidator.checkAdditionalDescription
  }

  const validationPictureTagObject: validationObject = {
    "text": PictureTagValidator.validateTagText
  }

  const groupAndSendData = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {

      const formData = new FormData();
      const mainInfoToEdit: { [key: string]: any } = {};

      for (let key in editedMainPictureInfo) {
        if (!editedMainPictureInfo.hasOwnProperty(key)) {
          continue;
        }

        if (editedMainPictureInfo[key] !== mainPictureInfo[key]) {
          mainInfoToEdit[key] = editedMainPictureInfo[key];
        }
      }

      for (let key in mainInfoToEdit) {
        //validate value by key using validation object and fullfill formData
        Boolean(validationMainInfoObject[key]) && validationMainInfoObject[key](mainInfoToEdit[key], true);
        formData.append(key, mainInfoToEdit[key])
      }

      let pictureSectionsToDeleteOnServer: number[] = [];
      let pictureSectionsToDeleteLocally: number[] = [];

      // Compairing edited picture sections array with initial picture sections array
      // if edited picture section have unique value in key which compares, add to the array of sections need to be updated
      // if section is new, need just to check title and description before adding to the array

      let pictureSectionsToSend = editedPictureSections.map(section => {
        if (section.toDelete) {
          if (section.alreadyExists) {
            pictureSectionsToDeleteOnServer.push(section.id);
            return undefined;
          }
          pictureSectionsToDeleteLocally.push(section.id);
          return undefined;
        }

        const sameSection = pictureSections.find((el) => +el.id === +section.id);

        if (!sameSection) {
          if (
            validationPictureInfoObject.title(section.title, true) &&
            validationPictureInfoObject.description(section.description, true)) {
            return section;
          }
          return undefined;
        };

        const editSectionObj: { [key: string]: any } = {};

        for (let sectionKey in section) {
          if (!section.hasOwnProperty(sectionKey)) {
            continue;
          }

          if (sectionKey === 'alreadyExists' || sectionKey === "toDelete" || sectionKey === "id") {
            continue;
          }

          if (section[sectionKey] !== sameSection?.[sectionKey]) {
            Boolean(validationPictureInfoObject[sectionKey]) && validationPictureInfoObject[sectionKey](section[sectionKey], true);
            editSectionObj[sectionKey] = section[sectionKey];
          }
        }

        if (Object.values(editSectionObj).length) {
          editSectionObj.id = section.id
          return editSectionObj;
        }

        return undefined;
      });

      pictureSectionsToSend = pictureSectionsToSend.filter(section => section !== undefined)
      formData.append("pictureInfos", JSON.stringify(pictureSectionsToSend));

      let pictureTagsToDeleteOnServer: number[] = [];
      let pictureTagsToDeleteLocally: number[] = [];

      // Compairing edited picture tags array with initial picture tags array
      // if edited picture tag have unique value in key which compares, add to the array of tags need to be updated
      // if tag is new, need just to check text before adding to the array

      let pictureTagsToSend = editedPictureTags.map(tag => {
        if (tag.toDelete) {
          if (tag.alreadyExists) {
            pictureTagsToDeleteOnServer.push(tag.id);
            return undefined;
          }
          pictureTagsToDeleteLocally.push(tag.id);
          return undefined;
        }
        const sameTag = pictureTags.find(tagObj => +tagObj.id === +tag.id);

        if (!sameTag) {
          if (validationPictureTagObject.text(tag.text, true)) {
            return tag;
          }
          return undefined;
        }

        const tagObject: { [key: string]: any } = {}

        for (let key in tag) {
          if (key === 'alreadyExists' || key === 'toDelete' || key === 'id') {
            continue;
          }

          if (tag[key] !== sameTag?.[key]) {
            Boolean(validationPictureTagObject[key]) && validationPictureTagObject[key](tag[key], true);
            tagObject[key] = tag[key]
          }
        }

        if (Object.values(tagObject).length) {
          tagObject.id = tag.id;
          return tagObject;
        }

        return undefined;
      });

      pictureTagsToSend = pictureTagsToSend.filter(tag => tag !== undefined);
      formData.append("pictureTags", JSON.stringify(pictureTagsToSend));

      if (
        !Object.values(mainInfoToEdit).length &&
        !pictureSectionsToSend.length &&
        !pictureTagsToSend.length &&
        !pictureSectionsToDeleteOnServer.length &&
        !pictureSectionsToDeleteLocally.length &&
        !pictureTagsToDeleteOnServer.length &&
        !pictureTagsToDeleteLocally.length) {
        alert("Nothing to change");
        return;
      }
      if (window.confirm("Are you sure you want to submit changes?")) {
        if (Object.values(mainInfoToEdit).length || pictureSectionsToSend.length || pictureTagsToSend.length) {
          if (pictureSectionsToDeleteOnServer.length) {
            await PictureInfoService.deletePictureInfo(pictureId, pictureSectionsToDeleteOnServer);
          }
          if (pictureTagsToDeleteOnServer.length) {
            await PictureTagService.deletePictureTagConnection(pictureId, pictureTagsToDeleteOnServer);
          }

          const response = await PictureService.editPicture(pictureId, formData);

          if (response.data.errors.length) {
            alert(response.data.errors.join("\n"))
          }

          pictureStore.pictures.rows = pictureStore.pictures.rows.map(picture => {
            if (picture.id !== response.data.picture.id) {
              return picture;
            }
            Object.keys(picture).forEach(pictureKey => {
              picture[pictureKey] = response.data.picture[pictureKey]
            });
            return picture;
          });

          setPictureParams(response.data.picture);
          return;
        }

        let filteredTags: tagObj[] = [];
        let filteredSections: sectionObj[] = [];

        if (pictureTagsToDeleteOnServer.length) {
          await PictureTagService.deletePictureTagConnection(pictureId, pictureTagsToDeleteOnServer);
          filteredTags = editedPictureTags.filter(tag => !pictureTagsToDeleteOnServer.some((tagToDeleteOnServerId) => tagToDeleteOnServerId === tag.id));
        }

        if (pictureTagsToDeleteLocally.length) {
          filteredTags = editedPictureTags.filter(tag => !pictureTagsToDeleteLocally.some((tagToDeleteLocallyId) => tagToDeleteLocallyId === tag.id));
        }

        if (pictureSectionsToDeleteOnServer.length) {
          await PictureInfoService.deletePictureInfo(pictureId, pictureSectionsToDeleteOnServer);
          filteredSections = editedPictureSections.filter(section => !pictureSectionsToDeleteOnServer.some(sectionToDeleteOnServerId => sectionToDeleteOnServerId === section.id));
        }

        if (pictureSectionsToDeleteLocally.length) {
          filteredSections = editedPictureSections.filter(section => !pictureSectionsToDeleteLocally.some(sectionToDeleteLocallyId => sectionToDeleteLocallyId === section.id));
        }

        setPictureTags(filteredTags);
        setEditedPictureTags(filteredTags);

        setPictureSections(filteredSections);
        setEditedPictureSections(filteredSections);
      }

    } catch (e: any) {
      if (e.isAxiosError) {
        alert(e.response.data.message);
        return;
      }

      alert(e.message);
    }

  };

  const clearAllChanges = async () => {
    if (window.confirm("Are you sure you want to clear all changes?")) {
      setEditedMainPictureInfo(mainPictureInfo);
      setEditedPictureSections(pictureSections.map(section => ({ ...section, alreadyExists: true })));
      setEditedPictureTags(pictureTags.map(tag => ({ ...tag, alreadyExists: true })));
    }
  }

  const onSetEditedPictureInfo = (paramName: string) => (e: ChangeEvent<any>) => {
    setEditedMainPictureInfo({ ...editedMainPictureInfo, [paramName]: e.target.value })
  }

  const setPictureParams = (data: IExtendedPictureObj) => {
    const mainInfo = {
      img: data.img,
      mainTitle: data.mainTitle,
      description: data.description,
      pictureTypeId: data.pictureTypeId
    }
    setMainPictureInfo(mainInfo);
    setEditedMainPictureInfo(mainInfo);

    setPictureSections(data.pictureInfos);
    setEditedPictureSections(data.pictureInfos.map(info => ({ ...info, alreadyExists: true })));

    setPictureTags(data.tags);
    setEditedPictureTags(data.tags.map(tag => ({ ...tag, alreadyExists: true })));
  };

  useEffect(() => {
    if (pictureId) {
      getPictureInfo(pictureId)
        .then((response) => {
          if (response) {
            setPictureParams(response.data)
          }
        });
    }
  }, [pictureId]);

  return (
    <form className={`${formStyles["form"]} ${pictureLoading ? formStyles["loading-form"] : ""}`}>
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
            alt={editedMainPictureInfo?.mainTitle}
            src={returnPictureLink(String(editedMainPictureInfo?.img))}></img>
          <span className={formStyles["img-span"]}>Choose another image</span>
        </label>


      </section >

      <section className={`${formStyles["info-section"]} ${infoSectionOpen ? "" : formStyles["closed"]}`}>
        <button
          type="button"
          className={formStyles["close-info-section-btn"]}
          onClick={(e) => setInfoSectionOpen(!infoSectionOpen)}>
          <ArrowIcon id={formStyles["close-icon"]} />
        </button>
        <div className={formStyles["info-wrapper"]}>
          <PicturesTypesSelect
            value={editedMainPictureInfo.pictureTypeId || ""}
            onChange={onSetEditedPictureInfo("pictureTypeId")} />
          <div className={formStyles["main-info"]}>
            <fieldset>
              <legend>Main info</legend>
              <textarea
                value={editedMainPictureInfo?.mainTitle}
                onChange={onSetEditedPictureInfo("mainTitle")} />
              <textarea
                value={editedMainPictureInfo?.description}
                onChange={onSetEditedPictureInfo("description")} />
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

          <StandartButton type="submit" onClick={groupAndSendData}>Submit changes</StandartButton>
        </div>
      </section>

      <DeletePictureBtn
        className={formStyles["delete-picture-btn"]}
        disabled={pictureLoading}
        isOwnPicture={true}
        pictureId={pictureId}
        pictureMainTitle={mainPictureInfo.mainTitle}
        setModalIsOpen={setModalIsOpen} />
    </form >
  )
};

export default EditPictureForm;