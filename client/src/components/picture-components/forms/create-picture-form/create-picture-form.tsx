import { useContext, useRef, useState } from "react";
import formStyles from "./create-picture-form.module.css";
import setFileInputCurrentImg from "../../../../utils/file-input-utils/setFileInputCurrentImg";
import { IPictureMainData } from "../../../../interfaces/forms/create-picture-interfaces";
import PictureService from "../../../../services/picture-service";
import ArrowIcon from "../../../../assets/img/icons/arrow-icon/arrow-icon";
import PicturesTypesSelect from "../../inputs/pictures-types-select/pictures-types-select";
import useFetching from "../../../../hooks/useFetching";
import StandartButton from "../../../../UI/standart-button/standart-button";
import NewTagList from "./new-tag-list/new-tag-list";
import NewSectionList from "./new-section-list/new-section-list";
import { Context } from "../../../..";

export interface newSectionObj {
  [key: string]: any,
  id: number,
  title: string,
  description: string
}
export interface newTagObj {
  id: number,
  text: string
}

interface ICreatePictureFormProps {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreatePictureForm = ({ setModalIsOpen }: ICreatePictureFormProps) => {
  const { pictureStore } = useContext(Context);
  const [mainData, setMainData] = useState<IPictureMainData>({
    img: undefined,
    mainTitle: '',
    description: '',
    pictureTypeId: null,
  });
  const [newSections, setNewSections] = useState<newSectionObj[]>([]);
  const [newTags, setNewTags] = useState<newTagObj[]>([]);
  const [infoSectionIsOpen, setInfoSectionIsOpen] = useState(true);

  const { executeCallback: sendPictureCreateRequest, isLoading: pictureRequsetIsLoading } = useFetching(createPicture)

  const addPictureInputRef = useRef<HTMLInputElement>(null);
  const addPictureInputBackgroundRef = useRef<HTMLImageElement>(null);

  function setBackgroundImg(imgFile: File | undefined) {
    setFileInputCurrentImg(addPictureInputBackgroundRef, imgFile, null)
  }

  // GROUP DATA TO SEND
  function groupData() {
    const formData = new FormData();

    // SETTING MAIN PICTURE CREATING DATA
    for (let key in mainData) {
      if (!mainData[key]) {
        continue;
      }
      formData.append(key, mainData[key]);
    }

    // SETTING NEW SECTIONS
    const sectionsToSend = newSections.filter(section => section.title.split(' ').join('') && section.description.split(' ').join(''));
    const tagsToSend = newTags.filter(tag => tag.text.split(' ').join(''));

    sectionsToSend.length && formData.append('pictureInfos', JSON.stringify(sectionsToSend));
    tagsToSend.length && formData.append('pictureTags', JSON.stringify(tagsToSend));

    return formData;
  }

  async function createPicture() {
    try {
      const response = await PictureService.createPicture(groupData());
      alert(response.data.message);
      pictureStore.addPictureLocally(response.data.picture);
      setModalIsOpen(false);
    } catch (e: any) {
      alert(e.response?.data?.message);
    }

  }

  return (
    <form className={formStyles["create-picture-form"]}>

      <section className={formStyles["set-img__section"]}>
        <label className={formStyles["img-input__label"]}>
          <input
            className={formStyles["img-input"]}
            ref={addPictureInputRef}
            type="file"
            accept='image/jpeg, image/jpg, image/png, image/webm'
            onChange={(e) => {
              setMainData({ ...mainData, img: e.target.files?.[0] })
              setBackgroundImg(e.target.files?.[0])
            }}></input>
          <img
            className={formStyles["img-input__background-img"]}
            alt=""
            ref={addPictureInputBackgroundRef}></img>
          <span className={formStyles["img-input__span"]}>Choose image</span>
        </label>
      </section>

      <section className={`${formStyles["info-about-img__section"]} ${formStyles[`info-section-${infoSectionIsOpen}`]}`}>
        <button className={formStyles["info-about-img__close-btn"]}
          onClick={(e) => {
            e.preventDefault();
            setInfoSectionIsOpen(!infoSectionIsOpen);
          }
          }><ArrowIcon id={formStyles["close-icon"]} /></button>

        <div className={formStyles["info-about-img__inputs-section"]}>
          <PicturesTypesSelect onChange={(e) => setMainData({ ...mainData, pictureTypeId: e.target.value })} />
          <label className={formStyles["main-title"]}>
            <input
              placeholder="Main title"
              value={mainData.mainTitle}
              onChange={(e) => setMainData({ ...mainData, mainTitle: e.target.value })}></input>
          </label>

          <label className={formStyles["main-description"]}>
            <textarea
              placeholder="Main description"
              value={mainData.description}
              onChange={(e) => setMainData({ ...mainData, description: e.target.value })} ></textarea>
          </label>

          <p className={formStyles["new-sections__header"]}>Additional sections</p>

          <NewSectionList sections={newSections} setSections={setNewSections} />

          <p className={formStyles["new-tags__section__header"]}>Tags</p>

          <NewTagList setTags={setNewTags} />

        </div>
      </section>

      <StandartButton
        className={formStyles["create-picture-btn"]}
        type="submit"
        disabled={mainData.mainTitle && mainData.img && !pictureRequsetIsLoading ? false : true}
        onClick={(e: React.ChangeEvent<any>) => {
          e.preventDefault();
          sendPictureCreateRequest();
        }}>Create picture</StandartButton>



    </form>


  )
};
export default CreatePictureForm;

