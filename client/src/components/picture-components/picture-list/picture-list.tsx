import listStyles from "./picture-list.module.css";
import { ChangeEvent, useCallback, useContext, useLayoutEffect, useState } from "react";
import PictureItem from "../picture-item/picture-item";
import PictureSearchPanel from "../picture-search-panel/picture-search-panel";
import ViewPictureModal from "../modals/view-picture-modal/view-picture-modal";
import EditPictureModal from "../modals/edit-picture-modal/edit-picture-modal";
import { Context } from "../../..";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import InfiniteScroll from "../../infinite-scroll/infinite-scroll";
import useDelayFetching from "../../../hooks/useDelayFetching";

interface IPictureListProps {
  userId: number,
  isPersonalGallery: boolean
};

const PictureList = ({ userId, isPersonalGallery }: IPictureListProps) => {
  const { pictureStore } = useContext(Context);

  const [viewPictureModalIsOpen, setViewPictureModalIsOpen] = useState(false);
  const [currentPictureId, setCurrentPictureId] = useState(0);
  const [rewriteState, setRewriteState] = useState(false);

  const getPictures = useCallback(async (rewrite = false, unmountFlag) => {
    await pictureStore.getPictures(rewrite, unmountFlag);

    if (rewrite) {
      setRewriteState(false);
    }

  }, [pictureStore]);

  const setRewriteStateTrue = useCallback(async () => {
    setRewriteState(true);
  }, [])
  const { executeCallback: delayedSetRewriteStateToTrue } = useDelayFetching(setRewriteStateTrue, 400);

  const setQueryParam = useCallback(async (paramName: string, paramValue: string | string[] | number | number[] | object) => {
    // if (pictureStore.picturesLoading) {
    //   return;
    // }

    runInAction(() => {
      pictureStore.queryParams[paramName] = paramValue;
      pictureStore.locallyAddedPicturesIds = [];
    });

    if (paramValue === "@" || paramValue === "#") {
      return;
    }
  }, [pictureStore])

  const onQueryStringChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    setQueryParam("queryString", event.target.value);
    delayedSetRewriteStateToTrue();
  }, [delayedSetRewriteStateToTrue, setQueryParam]);

  const onPictureTypeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setQueryParam("pictureTypeId", event.target.value);
    setRewriteState(true);
  }, [setQueryParam]);

  const onOrderParamChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const { cursor } = pictureStore.queryParams;
    let orderArr;

    try {
      orderArr = JSON.parse(event.target.value)
    } catch (e) {
      alert("Incorrect order param chosen, ordered by default createdAt DESC param. It may happened because of incorrect value in code")
      orderArr = ["createdAt", "DESC"];
    }
    setQueryParam("cursor", { ...cursor, key: orderArr[0], order: orderArr[1] });
    setRewriteState(true);
  }, [pictureStore.queryParams, setQueryParam]);

  useLayoutEffect(() => {
    runInAction(() => {
      pictureStore.queryParams.userId = userId;
      pictureStore.clearPictures();
      pictureStore.clearCursor();
    })
  }, [userId]);

  return (
    <article className={`${listStyles["picture-list__wrapper"]}`}>
      {
        isPersonalGallery ?
          <EditPictureModal isOpen={viewPictureModalIsOpen} setIsOpen={setViewPictureModalIsOpen} currentPictureId={currentPictureId} />
          :
          <ViewPictureModal isOpen={viewPictureModalIsOpen} setIsOpen={setViewPictureModalIsOpen} currentPictureId={currentPictureId} />
      }
      <PictureSearchPanel onQueryStringChange={onQueryStringChange} onPictureTypeChange={onPictureTypeChange} onOrderParamChange={onOrderParamChange} />
      <InfiniteScroll callback={getPictures} stopValue={pictureStore.allPicturesRecieved} rewrite={rewriteState}>
        {
          pictureStore.pictures.rows.map(pictureItem =>
            <PictureItem key={pictureItem.id} pictureItem={pictureItem} setCurrentPictureId={setCurrentPictureId} setIsOpen={setViewPictureModalIsOpen} />
          )
        }
      </InfiniteScroll>
    </article>
  )
};
export default observer(PictureList);