import listStyles from "./picture-list.module.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import useFetching from "../../../hooks/useFetching";
import PictureItem from "../picture-item/picture-item";
import PictureSearchPanel from "../picture-search-panel/picture-search-panel";
import useDelayFetching from "../../../hooks/useDelayFetching";
import ViewPictureModal from "../modals/view-picture-modal/view-picture-modal";
import EditPictureModal from "../modals/edit-picture-modal/edit-picture-modal";
import { Context } from "../../..";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import useWindowResize from "../../../hooks/useElementResize";

interface IPictureListProps {
  userId: number,
  isPersonalGallery: boolean
};

const PictureList = ({ userId, isPersonalGallery }: IPictureListProps) => {
  const { pictureStore } = useContext(Context);

  const pictureListContainer = useRef<HTMLElement>(null);

  const [viewPictureModalIsOpen, setViewPictureModalIsOpen] = useState(false);
  const [currentPictureId, setCurrentPictureId] = useState(0);

  const getPictures = useCallback(async (rewrite = false) => {
    let preventer = 0;
    if (!pictureListContainer.current || pictureStore.picturesLoading) {
      return;
    }

    let rewriteValue = rewrite;
    do {
      const data = await pictureStore.getPictures(rewriteValue);

      if (pictureStore.allPicturesRecieved) {
        break;
      }

      const { scrollTop, scrollHeight, clientHeight } = pictureListContainer.current;

      if (!data || data?.rows.length === 0 || scrollHeight - clientHeight - scrollTop >= 25) {
        break;
      }

      if (rewriteValue) {
        rewriteValue = false;
      }
      preventer++;

      if (preventer === 100) {
        break;
      }

    } while (true)
  }, [pictureListContainer, pictureStore]);

  const getPicturesOnResize = async () => {
    let preventer = 0
    if (!pictureListContainer.current) {
      return;
    }

    do {
      if (pictureStore.picturesLoading) {
        break;
      }

      const { scrollHeight, clientHeight } = pictureListContainer.current;

      if (scrollHeight > clientHeight) {
        break;
      }

      const data = await pictureStore.getPictures(false);

      if (data?.rows.length === 0 || !data) {
        break;
      }

      preventer++;

      if (preventer === 100) {
        break;
      }
    } while (true)
  }

  useWindowResize(getPicturesOnResize)

  const {
    executeCallback: fetchPictures, isLoading: fetchPicturesLoading
  } = useFetching(getPictures);

  const {
    executeCallback: delayedFetchPictures,
    isLoading: delayedFetchPicturesLoading,
  } = useDelayFetching(getPictures, 500);


  const getPictureListWithCurrentQueryParams = useCallback((target?: EventTarget, rewrite = false) => {
    if (target instanceof HTMLButtonElement || target instanceof HTMLSelectElement || !target) {
      fetchPictures(rewrite);
      return;
    }
    delayedFetchPictures(rewrite);

  }, [delayedFetchPictures, fetchPictures]);

  const onSearchPanelQueryChange = useCallback((target?: EventTarget) => {
    getPictureListWithCurrentQueryParams(target, true);
  }, [getPictureListWithCurrentQueryParams]);

  function infiniteLoading() {
    if (fetchPicturesLoading || delayedFetchPicturesLoading) {
      return;
    }

    if (pictureListContainer.current) {
      const { clientHeight, scrollTop, scrollHeight } = pictureListContainer.current;

      if (scrollHeight - clientHeight - scrollTop < 25) {
        fetchPictures();
      }
    }
  }

  useEffect(() => {
    runInAction(() => {
      pictureStore.queryParams.userId = userId ? userId : 0
    })
    getPictureListWithCurrentQueryParams(undefined, true);
  }, [userId]);

  return (
    <article className={`${listStyles["picture-list__wrapper"]} ${fetchPicturesLoading || delayedFetchPicturesLoading ? listStyles["loading-list"] : ""}`}>
      {
        isPersonalGallery ?
          <EditPictureModal isOpen={viewPictureModalIsOpen} setIsOpen={setViewPictureModalIsOpen} currentPictureId={currentPictureId} />
          :
          <ViewPictureModal isOpen={viewPictureModalIsOpen} setIsOpen={setViewPictureModalIsOpen} currentPictureId={currentPictureId} />
      }
      <PictureSearchPanel onChange={onSearchPanelQueryChange} />
      <section ref={pictureListContainer} className={listStyles["picture-list"]} onScroll={infiniteLoading}>
        {
          pictureStore.pictures.rows.map(pictureItem =>
            <PictureItem key={pictureItem.id} pictureItem={pictureItem} setCurrentPictureId={setCurrentPictureId} setIsOpen={setViewPictureModalIsOpen} />
          )
        }
      </section>
    </article>
  )
};
export default observer(PictureList);