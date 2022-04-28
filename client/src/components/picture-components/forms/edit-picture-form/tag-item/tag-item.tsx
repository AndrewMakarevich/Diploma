import { useRef } from "react";
import itemStyles from "./tag-item.module.css";
import MatchingTagsList from "../../../matching-tags-list/matching-tags-list";
import { tagObj } from "../edit-picture-form";
import DeleteButton from "../../../../../UI/delete-button/delete-button";

interface ITagItemProps {
  tag: tagObj,
  deleteTag: (tagId: number, alreadyExists?: boolean) => void,
  editTag: (text: string, tagId: number) => void
}

const TagItem = ({ tag, deleteTag, editTag }: ITagItemProps) => {
  const tagInputRef = useRef<HTMLInputElement>(null);
  return <div className={itemStyles["tag-item-wrapper"]}>
    {
      tag.alreadyExists ?
        <p className={itemStyles["tag-item-input"]}>{tag.text}</p>
        :
        <>
          <input className={itemStyles["tag-item-input"]} ref={tagInputRef} value={tag.text} onChange={(e) => editTag(e.target.value, tag.id)}></input>
          <MatchingTagsList tagObj={tag} setTagValue={editTag} tagInputRef={tagInputRef.current} />
        </>
    }
    <DeleteButton className={itemStyles["delete-tag-btn"]} type="button" onClick={() => deleteTag(tag.id, tag.alreadyExists)}>Delete</DeleteButton>
  </div>
};

export default TagItem;