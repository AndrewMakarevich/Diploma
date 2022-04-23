import { useRef } from "react";
import DeleteButton from "../../../../../UI/delete-button/delete-button";
import MatchingTagsList from "../../../matching-tags-list/matching-tags-list";
import itemStyles from "./new-tag-item.module.css";

interface INewTagItemProps {
  newTag: { id: number, text: string },
  editNewTag: (paramValue: string, tagToEditId: number) => void,
  deleteNewTag: (tagToDeleteId: number) => void
}

const NewTagItem = ({ newTag, editNewTag, deleteNewTag }: INewTagItemProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={itemStyles["new-tag__block"]} key={newTag.id}>

      <input
        ref={inputRef}
        value={newTag.text}
        onChange={(e) => {
          editNewTag(e.target.value, newTag.id);
        }}></input>
      <MatchingTagsList tagInputRef={inputRef.current} tagObj={newTag} setTagValue={editNewTag} />
      <DeleteButton
        className={itemStyles["delete-tag-btn"]}
        onClick={(e: React.ChangeEvent<any>) => {
          e.preventDefault();
          deleteNewTag(newTag.id);
        }}>delete</DeleteButton>

    </div>
  )
};

export default NewTagItem;