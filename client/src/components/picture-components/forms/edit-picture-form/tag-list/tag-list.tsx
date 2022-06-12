import listStyles from "./tag-list.module.css";
import StandartButton from "../../../../../UI/standart-button/standart-button";
import TagItem from "../tag-item/tag-item";
import { tagObj } from "../interfaces";

interface ITagListProps {
  pictureId: number,
  tagsArr: tagObj[],
  initialTagsArr: tagObj[],
  setTagsArr: React.Dispatch<React.SetStateAction<tagObj[]>>,
  setInitialTagsArr: React.Dispatch<React.SetStateAction<tagObj[]>>
}

const TagList = ({ tagsArr, setTagsArr }: ITagListProps) => {
  const addNewTag = () => {
    setTagsArr([...tagsArr, { id: Date.now(), text: "" }]);
  };

  const editNewTag = (text: string, tagId: number) => {
    setTagsArr(tagsArr.map(tag => {
      if (+tag.id === +tagId) {
        return { ...tag, text }
      }

      return tag
    }));
  };

  const resetTagToDeleteOption = (option: boolean, tagId: number) => {
    setTagsArr(tagsArr.map(tag => {
      if (+tag.id === tagId) {
        return { ...tag, toDelete: option }
      }
      return tag
    }));
  }

  const deleteTag = async (tag: tagObj, alreadyExists?: boolean) => {
    if (!tag.text.split(" ").join("") && !alreadyExists) {
      setTagsArr(tagsArr.filter(tagObj => +tagObj.id !== +tag.id));
      return;
    }
    resetTagToDeleteOption(true, tag.id)
  };

  const reestablishTag = async (tagId: number) => {
    resetTagToDeleteOption(false, tagId);
  }
  return (
    <section className={listStyles["tag-list-wrapper"]}>
      <div className={`${listStyles["tag-list"]}`}>
        {
          tagsArr.map(tag => (
            <TagItem key={tag.id} tag={tag} deleteTag={deleteTag} editTag={editNewTag} reestablishTag={reestablishTag} />
          ))
        }
      </div>
      <StandartButton type="button" onClick={addNewTag}>Add tag</StandartButton>
    </section>

  )
};

export default TagList;