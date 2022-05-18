import listStyles from "./new-tag-list.module.css";
import { useEffect, useState } from "react";
import NewTagItem from "../new-tag-item/new-tag-item";
import StandartButton from "../../../../../UI/standart-button/standart-button";
import { newTagObj } from "../create-picture-form";

interface INewTagList {
  setTags: React.Dispatch<React.SetStateAction<newTagObj[]>>
}

const NewTagList = ({ setTags }: INewTagList) => {
  const [newTags, setNewTags] = useState<newTagObj[]>([]);

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

  function deleteNewTag(tagToDeleteId: number) {

    setNewTags(newTags.filter(newTag => newTag.id !== tagToDeleteId));
  }

  useEffect(() => {
    setTags(newTags);
  }, [newTags]);

  return (
    <>
      <section className={listStyles["new-tags__section"]}>
        {
          newTags.map(newTag =>
            <NewTagItem newTag={newTag} editNewTag={editNewTag} deleteNewTag={deleteNewTag} />
          )
        }
      </section>
      <StandartButton
        type="button"
        onClick={addNewTag}>
        add new tag
      </StandartButton>
    </>
  )
};

export default NewTagList;