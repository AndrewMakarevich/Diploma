import { ChangeEvent, useCallback, useMemo, useState } from "react";
import useDelayFetching from "../../../hooks/useDelayFetching";
import { ITagResponseObj } from "../../../interfaces/http/response/pictureTagInterfaces";
import { IGetPictureTagsCursor } from "../../../interfaces/services/pictureTagsInterfaces";
import PictureTagService from "../../../services/picture-tag-service";
import Table from "../../table/table";
import CreatePictureTagForm from "../forms/create-picture-tag-form/create-picture-tag-form";
import EditPictureTagForm from "../forms/edit-picture-tag-form/edit-picture-tag-form";
import PictureTagsSearchPanel from "../picture-tags-search-panel/picture-tags-search-panel";
import { IAction } from "../../table/interfaces";
import InfiniteScroll from "../../infinite-scroll/infinite-scroll";
import ModalWindow from "../../modal-window/modal-window";
import StandartButton from "../../../UI/standart-button/standart-button";

import panelStyles from "./picture-tags-panel.module.css";
import useFetching from "../../../hooks/useFetching";
import LoadingNotificator from "../../lodaing-notificator/loading-notificator";
import NoResultsNotificator from "../../../UI/no-results-notificator/no-results-notificator";

interface ITagsPaginationParams {
  limit: number,
  cursor: IGetPictureTagsCursor
}

const PictureTagsPanel = () => {
  const [queryString, setQueryString] = useState("");
  const [pictureTags, setPictureTags] = useState<ITagResponseObj[]>([]);
  const [rewriteTags, setRewriteTags] = useState(false);
  const [paginationParams, setPaginationParams] = useState<ITagsPaginationParams>({
    limit: 25, cursor: {
      id: 0,
      key: "createdAt",
      value: 0,
      order: "ASC"
    }
  });
  const [locallyCreatedTagsIds, setLocallyCreatedTagsIds] = useState<number[]>([]);
  const [allTagsRecieved, setAllTagsRecieved] = useState(false);
  const [createPanelIsOpen, setCreatePanelIsOpen] = useState(false);
  const [editPanelIsOpen, setPanelIsOpen] = useState(false);
  const [currentTagToEditId, setCurrentTagToEditId] = useState(0);
  const currentTagToEdit = useMemo(() => pictureTags.find(tag => tag.id === currentTagToEditId), [currentTagToEditId, pictureTags])

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

  const getTags = useCallback(async (rewrite: boolean, unmountFlag: React.MutableRefObject<boolean>) => {
    let { cursor, limit } = paginationParams;

    if (rewriteTags) {
      cursor = { ...cursor, id: 0, value: 0 };
      setAllTagsRecieved(false);
    }

    const tags = await sendRequestToGetTags(queryString, cursor, limit);

    if (unmountFlag.current) {
      setAllTagsRecieved(false);
      return;
    }

    if (rewriteTags) {
      setPictureTags(tags);
      setRewriteTags(false);
    } else {
      setPictureTags([...pictureTags, ...tags])
    }

    if (tags.length === 0) {
      setRewriteTags(false);
      setAllTagsRecieved(true);
      setTimeout(() => setAllTagsRecieved(false), 1000 * 60);
      return;
    }

    const lastRecievedTag = tags[tags.length - 1]
    setPaginationParams({ ...paginationParams, cursor: { ...cursor, id: lastRecievedTag.id, value: lastRecievedTag[cursor.key] } })

  }, [queryString, paginationParams, pictureTags, sendRequestToGetTags, rewriteTags]);

  const { executeCallback: fetchTags, isLoading: tagsLoading } = useFetching(getTags);

  const setRewriteStateToTrue = useCallback(async () => {
    setRewriteTags(true);
  }, []);

  const { executeCallback: delaySetRewriteState } = useDelayFetching(setRewriteStateToTrue, 400);

  const onQueryStringChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQueryString(event.target.value);
    setLocallyCreatedTagsIds([]);
    delaySetRewriteState();
  }, [delaySetRewriteState])

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
    setRewriteTags(true);
  }, [paginationParams])

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
  }, []);

  const openCreatePanel = useCallback(() => {
    setCreatePanelIsOpen(true);
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

  return (
    <>
      <PictureTagsSearchPanel onQueryStringChange={onQueryStringChange} onOrderParamChange={onOrderParamChange} isLoading={tagsLoading} />
      <div className={panelStyles["forms"]}>
        <StandartButton onClick={openCreatePanel}>Create new tag</StandartButton>
        {
          Boolean(createPanelIsOpen) &&
          <ModalWindow isOpen={createPanelIsOpen} setIsOpen={setCreatePanelIsOpen}>
            <CreatePictureTagForm actualizeList={onCreateNewTag} />
          </ModalWindow>
        }
        {
          Boolean(editPanelIsOpen) && Boolean(currentTagToEdit) &&
          <ModalWindow isOpen={editPanelIsOpen} setIsOpen={setPanelIsOpen}>
            <EditPictureTagForm initialParams={currentTagToEdit!} actualizeList={onUpdateTag} />
          </ModalWindow>
        }
      </div>
      <InfiniteScroll callback={fetchTags} stopValue={allTagsRecieved} rewrite={rewriteTags}>
        <Table tableHeaders={["ID", "Text", "Attached pictures amount"]} paramsToShow={["id", "text", "attachedPicturesAmount"]} entities={pictureTags} actions={actionsArr} />
      </InfiniteScroll>
      {
        Boolean(!tagsLoading && !pictureTags.length) && <NoResultsNotificator />
      }
      <LoadingNotificator isLoading={tagsLoading} />
    </>
  )
};

export default PictureTagsPanel;