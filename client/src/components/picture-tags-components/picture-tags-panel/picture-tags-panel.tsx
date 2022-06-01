import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDelayFetching from "../../../hooks/useDelayFetching";
import useWindowResize from "../../../hooks/useElementResize";
import useFetching from "../../../hooks/useFetching";
import { ITagResponseObj } from "../../../interfaces/http/response/pictureTagInterfaces";
import { IGetPictureTagsCursor } from "../../../interfaces/services/pictureTagsInterfaces";
import PictureTagService from "../../../services/picture-tag-service";
import Table from "../../table/table";
import CreatePictureTagForm from "../forms/create-picture-tag-form/create-picture-tag-form";
import EditPictureTagForm from "../forms/edit-picture-tag-form/edit-picture-tag-form";
import PictureTagsSearchPanel from "../picture-tags-search-panel/picture-tags-search-panel";
import { IAction } from "../../table/interfaces";

import panelStyles from "./picture-tags-panel.module.css";

interface ITagsPaginationParams {
  limit: number,
  cursor: IGetPictureTagsCursor
}

const PictureTagsPanel = () => {
  const pictureTagsContainerRef = useRef<HTMLDivElement>(null);
  const [queryString, setQueryString] = useState("");
  const [pictureTags, setPictureTags] = useState<ITagResponseObj[]>([]);
  const [paginationParams, setPaginationParams] = useState<ITagsPaginationParams>({
    limit: 5, cursor: {
      id: 0,
      key: "createdAt",
      value: 0,
      order: "ASC"
    }
  });
  const [locallyCreatedTagsIds, setLocallyCreatedTagsIds] = useState<number[]>([]);
  const [allTagsRecieved, setAllTagsRecieved] = useState(false);
  const [editPanelIsOpen, setPanelIsOpen] = useState(false);
  const [currentTagToEditId, setCurrentTagToEditId] = useState(0);

  const sendRequestToGetTags = useCallback(async (queryString: string, cursor: IGetPictureTagsCursor, limit: number) => {
    const { data } = await PictureTagService.getTags(queryString, cursor, limit);
    const parsedData = data.rows.filter(tag => !locallyCreatedTagsIds.some(tagId => tagId === tag.id));
    return parsedData;
  }, [locallyCreatedTagsIds]);

  const sendRequestToDeleteTag = useCallback(async (pictureTag: ITagResponseObj) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      const response = await PictureTagService.deleteTag(pictureTag.id);
      alert(response.data.message)
      setPictureTags(pictureTags.filter(tag => tag.id !== pictureTag.id));
    }
  }, [pictureTags]);

  const getTags = useCallback(async (
    queryStringValue = queryString,
    cursorVal = paginationParams.cursor,
    limitVal = paginationParams.limit,
    rewrite = false) => {
    if (!pictureTagsContainerRef.current) {
      return;
    }

    if (!rewrite && allTagsRecieved) {
      return;
    }

    let preventer = 0;
    let cursorState = cursorVal;
    let rewriteState = rewrite;
    let pictureTagsState = pictureTags;

    do {
      if (rewriteState) {
        cursorState = { ...cursorState, id: 0, value: 0 }
      }

      const tags = await sendRequestToGetTags(queryStringValue, cursorState, limitVal);

      if (!tags || tags.length === 0) {
        setAllTagsRecieved(true);
        setTimeout(() => setAllTagsRecieved(false), 1000 * 60)
        break;
      }

      if (rewriteState) {
        rewriteState = false;
        pictureTagsState = tags;
        setPictureTags(pictureTagsState);
      } else {
        pictureTagsState = [...pictureTagsState, ...tags];
        setPictureTags(pictureTagsState);
      }

      const lastResElement = tags[tags.length - 1];
      cursorState = { ...cursorState, id: lastResElement["id"], value: lastResElement[cursorState.key] }
      const { scrollTop, scrollHeight, clientHeight } = pictureTagsContainerRef.current;

      if (scrollHeight - clientHeight - scrollTop >= 25) {
        break;
      }

      preventer++;
    } while (preventer < 99)
    setPaginationParams({ ...paginationParams, cursor: cursorState });
  }, [queryString, paginationParams, pictureTags, allTagsRecieved, sendRequestToGetTags]);

  const { executeCallback: fetchTags, isLoading: tagsLoading } = useFetching(getTags);
  const { executeCallback: delayedFetchTags, isLoading: delayedTagsLoading } = useDelayFetching(getTags, 400);

  const getTagsBasedOnElementType = useCallback((
    rewrite = false,
    event: ChangeEvent,
    queryStringVal = queryString,
    cursor = paginationParams.cursor,
    limit = paginationParams.limit,) => {
    if (event.target instanceof HTMLInputElement) {
      delayedFetchTags(queryStringVal, cursor, limit, rewrite);
      return;
    }

    fetchTags(queryStringVal, cursor, limit, rewrite);
  }, [queryString, paginationParams, delayedFetchTags, fetchTags])

  const onQueryStringChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQueryString(event.target.value);
    getTagsBasedOnElementType(true, event, event.target.value);
  }, [getTagsBasedOnElementType])

  const onOrderParamChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    let parsedValue;
    try {
      parsedValue = JSON.parse(event.target.value);
    } catch (e) {
      parsedValue = ["createdAt", "DESC"]
    }

    const { cursor } = paginationParams;
    const newCursorState = { ...cursor, key: parsedValue[0], order: parsedValue[1] }
    setPaginationParams({ ...paginationParams, cursor: newCursorState });

    getTagsBasedOnElementType(true, event, undefined, newCursorState)
  }, [paginationParams, getTagsBasedOnElementType])

  const getTagsOnResize = useCallback(async () => {
    let preventer = 0;

    if (allTagsRecieved || !pictureTagsContainerRef.current) {
      return;
    }
    const { limit, cursor } = paginationParams;
    let cursorState = cursor;
    let pictureTagsState = pictureTags;

    do {
      const { clientHeight, scrollHeight } = pictureTagsContainerRef.current;

      if (scrollHeight > clientHeight) {
        break;
      }

      const tags = await sendRequestToGetTags(queryString, cursorState, limit);

      if (!tags || tags.length === 0) {
        setAllTagsRecieved(true);
        break;
      }

      const lastArrElement = tags[tags.length - 1];
      cursorState = { ...cursorState, id: lastArrElement["id"], value: lastArrElement[cursorState.key] }
      pictureTagsState = [...pictureTagsState, ...tags];
      setPictureTags(pictureTagsState);
      preventer++;
    } while (preventer < 99)

    setPaginationParams({ ...paginationParams, cursor: cursorState });
  }, [allTagsRecieved, paginationParams, queryString, pictureTags, sendRequestToGetTags]);
  const { executeCallback: fetchTagsOnResize, isLoading: tagsOnResizeLoading } = useFetching(getTagsOnResize);

  useWindowResize(fetchTagsOnResize);

  const infiniteLoading = useCallback(() => {
    if (!pictureTagsContainerRef.current || tagsLoading || delayedTagsLoading || tagsOnResizeLoading) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = pictureTagsContainerRef.current;

    if (scrollHeight - clientHeight - scrollTop < 25) {
      fetchTags();
    }
  }, [pictureTagsContainerRef, tagsLoading, delayedTagsLoading, fetchTags, tagsOnResizeLoading]);

  const onCreateNewTag = useCallback((newTag: ITagResponseObj) => {
    setPictureTags([...pictureTags, newTag]);
    setLocallyCreatedTagsIds([...locallyCreatedTagsIds, newTag.id]);
  }, [pictureTags, locallyCreatedTagsIds]);

  const onUpdateTag = useCallback((tagId: number, tagText: string) => {
    setPictureTags(pictureTags.map(tag => {
      if (tag.id === tagId) {
        return { ...tag, text: tagText }
      }

      return tag
    }))
  }, [pictureTags]);

  const openEditPanel = useCallback((pictureTag: ITagResponseObj) => {
    setCurrentTagToEditId(pictureTag.id);
    setPanelIsOpen(true)
  }, [])

  const actionsArr: IAction[] = useMemo(() => [
    {
      header: "edit",
      clickHandler: openEditPanel
    },
    {
      header: "delete",
      clickHandler: sendRequestToDeleteTag
    }
  ], [openEditPanel, sendRequestToDeleteTag])

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <>
      <PictureTagsSearchPanel onQueryStringChange={onQueryStringChange} onOrderParamChange={onOrderParamChange} />
      <div className={panelStyles["forms"]}>
        <CreatePictureTagForm actualizeList={onCreateNewTag} />
        {
          Boolean(editPanelIsOpen) && <EditPictureTagForm initialParams={pictureTags.find(tag => tag.id === currentTagToEditId)} actualizeList={onUpdateTag} />
        }
      </div>
      <div ref={pictureTagsContainerRef} className={panelStyles["container"]} onScroll={infiniteLoading}>
        <Table tableHeaders={["ID", "Text", "Attached pictures amount"]} paramsToShow={["id", "text", "attachedPicturesAmount"]} entities={pictureTags} actions={actionsArr} />
      </div>
    </>

  )
};

export default PictureTagsPanel;