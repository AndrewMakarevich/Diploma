import listStyles from "./tag-list.module.css";
import PictureTagService from "../../../../../services/picture-tag-service";
import StandartButton from "../../../../../UI/standart-button/standart-button";
import { tagObj } from "../edit-picture-form";
import TagItem from "../tag-item/tag-item";

interface ITagListProps {
  pictureId: number,
  tagsArr: tagObj[],
  initialTagsArr: tagObj[],
  setTagsArr: React.Dispatch<React.SetStateAction<tagObj[]>>,
  setInitialTagsArr: React.Dispatch<React.SetStateAction<tagObj[]>>
}

const TagList = ({ pictureId, tagsArr, setTagsArr, initialTagsArr, setInitialTagsArr }: ITagListProps) => {
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

  const deleteTag = async (tagId: number, alreadyExists?: boolean) => {
    if (alreadyExists) {
      if (window.confirm("Are you sure you want to delete this tag?")) {
        await PictureTagService.deletePictureTagConnection(pictureId, tagId);
        setInitialTagsArr(initialTagsArr.filter(tag => +tag.id !== +tagId))
      }
    };
    setTagsArr(tagsArr.filter(tag => +tag.id !== +tagId))

  };
  return (
    <section className={listStyles["tag-list-wrapper"]}>
      <div className={listStyles["tag-list"]}>
        {
          tagsArr.map(tag => (
            <TagItem tag={tag} deleteTag={deleteTag} editTag={editNewTag} />
          ))
        }
      </div>
      <StandartButton onClick={(e) => {
        e.preventDefault();
        addNewTag();
      }}>Add tag</StandartButton>
    </section>

  )
};

export default TagList;