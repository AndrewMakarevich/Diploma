import { useEffect, useRef, useState } from "react";
import formStyles from "./create-picture-form.module.css";
import setFileInputCurrentImg from "../../../utils/file-input-utils/setFileInputCurrentImg";

interface newSectionObj {
  id: number,
  title: string,
  description: string
}

const CreatePictureForm = () => {
  const addPictureInputRef = useRef<HTMLInputElement>(null);
  const addPictureInputBackgroundRef = useRef<HTMLImageElement>(null);

  function setImg(imgFile: File | undefined) {
    setFileInputCurrentImg(addPictureInputBackgroundRef, imgFile, '')
  }

  const [newSections, setNewSections] = useState<newSectionObj[]>([]);

  function addNewSection() {
    setNewSections([...newSections, { id: Date.now(), title: "", description: "" }]);
  }
  function deleteNewSection(sectionToDelete: newSectionObj) {
    setNewSections(newSections.filter(newSection => newSection.id !== sectionToDelete.id));
  }

  useEffect(() => {
    console.log(newSections);
  }, [newSections])

  return (
    <form className={formStyles["create-picture-form"]}>

      <section className={formStyles["set-img__section"]}>
        <label className={formStyles["img-input__label"]}>
          Image:
          <input
            className={formStyles["img-input"]}
            ref={addPictureInputRef}
            type="file"
            accept='image/jpeg, image/jpg, image/png, image/webm'
            onChange={(e) => {
              setImg(e.target.files?.[0])
            }}></input>
          <img
            className={formStyles["img-input__background-img"]}
            alt="Current img"
            ref={addPictureInputBackgroundRef}></img>
          <span className={formStyles["img-input__span"]}></span>
        </label>
      </section>

      <section className={formStyles["info-about-img__section"]}>
        <label>
          Main title:
          <input></input>
        </label>

        <label>
          Main description:
          <textarea></textarea>
        </label>
        {
          newSections.map(newSection =>
            <div key={newSection.id}>
              <label>
                Title:
                <input></input>
              </label>
              <label>
                Description:
                <input></input>
              </label>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteNewSection(newSection);
                }}>delete section</button>
            </div>
          )
        }
        <button onClick={(e) => {
          e.preventDefault();
          addNewSection();
        }}>add new section</button>
      </section>

    </form>
  )
};
export default CreatePictureForm;