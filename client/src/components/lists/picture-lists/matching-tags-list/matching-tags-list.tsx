import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import componentStyles from "./matching-tags-list.module.css";
import useDelayFetching from "../../../../hooks/useDelayFetching";
import { ITagsByTextResponseObj } from "../../../../interfaces/http/response/pictureTagInterfaces";
import PictureTagService from "../../../../services/picture-tag-service";
import { newTagObj } from "../../../forms/picture-forms/create-picture-form";

interface IMatchingTagsListProps {
  tagInputRef: HTMLInputElement | null,
  tagObj: newTagObj,
  setTagValue: Function
}

const MatchingTagsList = ({ tagInputRef, tagObj, setTagValue }: IMatchingTagsListProps) => {
  const [canBeShown, setCanBeShown] = useState(true);
  const {
    executeCallback: findTags,
    isLoading: tagsIsLoading,
    executeResult: tagsArray } = useDelayFetching<AxiosResponse<ITagsByTextResponseObj[]>>(() => PictureTagService.getTagByTagText(tagObj.text), 1000);

  useEffect(() => {
    if (tagObj.text) {
      findTags();
    }
  }, [tagObj]);

  useEffect(() => {
    // console.log(tagInputRef);
    if (tagInputRef) {
      tagInputRef!.onblur = () => {
        setCanBeShown(false);
      }
      tagInputRef!.onfocus = () => {
        setCanBeShown(true);
      }
    }

  }, [tagInputRef]);

  if (canBeShown && tagObj.text && tagsArray?.data.length) {
    return (
      <article className={componentStyles["tags-list"]}>
        {
          tagsArray?.data.map(tag =>
            <section key={tag.id} className={componentStyles["tag-item"]}>
              <button
                onClick={
                  (e) => {
                    e.preventDefault();
                    if (tagObj.text !== tag.text) setTagValue(tag.text, tagObj.id);
                  }
                }>{tag.text}</button>
              <p>{tag.pictures}</p>
            </section>
          )
        }
      </article>
    )
  }

  return null;

};
export default MatchingTagsList;
