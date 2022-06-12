import { useRef } from "react";
import itemStyles from "./tag-item.module.css";
import MatchingTagsList from "../../../matching-tags-list/matching-tags-list";
import DeleteButton from "../../../../../UI/delete-button/delete-button";
import StandartButton from "../../../../../UI/standart-button/standart-button";
import { tagObj } from "../interfaces";

interface ITagItemProps {
  tag: tagObj,
  deleteTag: (tag: tagObj, alreadyExists?: boolean) => void,
  reestablishTag: (tagId: number) => void
  editTag: (text: string, tagId: number) => void
}

const TagItem = ({ tag, deleteTag, reestablishTag, editTag }: ITagItemProps) => {
  const tagInputRef = useRef<HTMLInputElement>(null);
  return <div className={`${itemStyles["tag-item-wrapper"]} ${tag.toDelete ? itemStyles["to-delete"] : ""}`}>
    {
      tag.alreadyExists ?
        <p className={itemStyles["tag-item-input"]}>{tag.text}</p>
        :
        <>
          <input className={itemStyles["tag-item-input"]} ref={tagInputRef} value={tag.text} onChange={(e) => editTag(e.target.value, tag.id)}></input>
          <MatchingTagsList tagObj={tag} setTagValue={editTag} tagInputRef={tagInputRef.current} />
        </>
    }
    {
      tag.toDelete ?
        <StandartButton className={itemStyles["reestablish-btn"]} type="button" onClick={() => reestablishTag(tag.id)}>Reestablish</StandartButton>
        :
        null
    }
    <DeleteButton className={itemStyles["delete-tag-btn"]} type="button" onClick={() => deleteTag(tag, tag.alreadyExists)}>Delete</DeleteButton>
  </div>
};

export default TagItem;