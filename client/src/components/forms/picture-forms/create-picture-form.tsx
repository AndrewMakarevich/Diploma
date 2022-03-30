import { useRef, useState } from "react";
import formStyles from "./create-picture-form.module.css";
import commonBtnStyles from "../../../common-styles/btn.module.css";
import setFileInputCurrentImg from "../../../utils/file-input-utils/setFileInputCurrentImg";
import { IPictureMainData } from "../../../interfaces/forms/create-picture-interfaces";
import PictureService from "../../../services/picture-service";
import ArrowIcon from "../../../assets/img/icons/arrow-icon/arrow-icon";

interface newSectionObj {
  [key: string]: any,
  id: number,
  title: string,
  description: string
}
interface newTagObj {
  id: number,
  text: string
}

const CreatePictureForm = () => {
  const [mainData, setMainData] = useState<IPictureMainData>({
    img: undefined,
    mainTitle: '',
    description: ''
  });
  const [newSections, setNewSections] = useState<newSectionObj[]>([]);
  const [newTags, setNewTags] = useState<newTagObj[]>([]);
  const [infoSectionIsOpen, setInfoSectionIsOpen] = useState(true);

  const addPictureInputRef = useRef<HTMLInputElement>(null);
  const addPictureInputBackgroundRef = useRef<HTMLImageElement>(null);

  function setBackgroundImg(imgFile: File | undefined) {
    setFileInputCurrentImg(addPictureInputBackgroundRef, imgFile, null)
  }

  // NEW SECTION METHODS
  function addNewSection() {
    setNewSections([...newSections, { id: Date.now(), title: "", description: "" }]);
  }

  function editNewSection(paramName: string, paramValue: string, sectionToEditId: number) {
    setNewSections(newSections.map(newSection => {
      if (newSection.id !== sectionToEditId) {
        return newSection;
      }

      return { ...newSection, [paramName]: paramValue }
    }));
  }

  function deleteNewSection(sectionToDelete: newSectionObj) {
    setNewSections(newSections.filter(newSection => newSection.id !== sectionToDelete.id));
  }

  // NEW TAG METHODS
  function addNewTag() {
    setNewTags([...newTags, { id: Date.now(), text: "" }]);
  }

  function editNewTag(paramValue: string, tagToEditId: number) {
    setNewTags(newTags.map(newTag => {
      if (newTag.id !== tagToEditId) {
        return newTag;
      }

      return { ...newTag, text: paramValue }
    }));
  }

  function deleteNewTag(tagToDelete: newTagObj) {
    setNewTags(newTags.filter(newTag => newTag.id !== tagToDelete.id));
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

          {
            newSections.map(newSection =>
              <div key={newSection.id} className={formStyles["new-section"]}>
                <label>
                  <input
                    placeholder="Title"
                    value={newSection.title}
                    onChange={(e) => editNewSection('title', e.target.value, newSection.id)}></input>
                </label>
                <label>
                  <textarea
                    placeholder="Description"
                    value={newSection.description}
                    onChange={(e) => editNewSection('description', e.target.value, newSection.id)}></textarea>
                </label>
                <button
                  className={formStyles["delete-new-section-btn"]}
                  onClick={(e) => {
                    e.preventDefault();
                    deleteNewSection(newSection);
                  }}>delete section</button>
              </div>
            )
          }

          <button
            className={commonBtnStyles["standart-btn"]}
            onClick={(e) => {
              e.preventDefault();
              addNewSection();
            }}>add new section</button>

          <p className={formStyles["new-tags__section__header"]}>Tags</p>

          <section className={formStyles["new-tags__section"]}>
            {
              newTags.map(newTag =>
                <div className={formStyles["new-tag__block"]} key={newTag.id}>

                  <input
                    value={newTag.text}
                    onChange={(e) => {
                      editNewTag(e.target.value, newTag.id)
                    }}></input>
                  <button
                    className={commonBtnStyles["remove-btn"]}
                    onClick={(e) => {
                      e.preventDefault();
                      deleteNewTag(newTag);
                    }}>delete</button>

                </div>
              )
            }
          </section>

          <button
            className={commonBtnStyles["standart-btn"]}
            onClick={(e) => {
              e.preventDefault();
              addNewTag();
            }}>
            add new tag
          </button>
        </div>
      </section>

      <button className={formStyles["create-picture-btn"]}
        type="submit"
        disabled={mainData.mainTitle && mainData.img ? false : true}
        onClick={(e) => {
          e.preventDefault();
          createPicture();
        }}>Create picture</button>

    </form>


  )
};
export default CreatePictureForm;
