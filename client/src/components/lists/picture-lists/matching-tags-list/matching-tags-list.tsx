import { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
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
    executeResult: tagsArray }
    = useDelayFetching<AxiosResponse<ITagsByTextResponseObj[]>>(() => PictureTagService.getTagByTagText(tagObj.text), 1000);
  const matchingTagsListRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Each time, tag changed, send the request to find common tags
    if (tagObj.text) {
      findTags();
    }
  }, [tagObj]);

  function decideToShowList(e: KeyboardEvent | MouseEvent) {
    if (e instanceof KeyboardEvent) {

      if (e.key !== "Tab" && canBeShown) {
        return;
      }
    }

    if (document.activeElement !== tagInputRef && document.activeElement!.parentElement?.parentElement !== matchingTagsListRef.current) {
      setCanBeShown(false)
    } else {
      setCanBeShown(true)
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', decideToShowList);
    document.addEventListener('mouseup', decideToShowList);

    return () => {
      console.log('UNMOUNT');
      document.removeEventListener('keyup', decideToShowList);
      document.removeEventListener('mouseup', decideToShowList);
    }
  }, [tagInputRef]);

  if (canBeShown && tagObj.text && tagsArray?.data.length && !tagsIsLoading) {
    return (
      <article ref={matchingTagsListRef} className={componentStyles["tags-list"]}>
        {
          tagsArray?.data.map(tag =>
            <section key={tag.id} className={componentStyles["tag-item"]}>
              <button
                onClick={
                  (e) => {
                    e.preventDefault();
                    if (tagObj.text !== tag.text) { // If the text of the chosen from the list tag aren't equal to the value in the input, set this text as value
                      setTagValue(tag.text, tagObj.id);
                      tagsArray.data = []; // clear tags list
                    };
                    tagInputRef!.focus();
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
