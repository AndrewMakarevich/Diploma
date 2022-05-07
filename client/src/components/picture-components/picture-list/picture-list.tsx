import listStyles from "./picture-list.module.css";
import { AxiosResponse } from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import useFetching from "../../../hooks/useFetching";
import { IGetPicturesResponse } from "../../../interfaces/http/response/pictureInterfaces";
import PictureService from "../../../services/picture-service";
import PictureItem from "../picture-item/picture-item";
import SearchPanel from "../search-panel/search-panel";
import useDelayFetching from "../../../hooks/useDelayFetching";
import PaginationInput from "../../inputs/pagination-input/pagination-input";
import ViewPictureModal from "../modals/view-picture-modal/view-picture-modal";
import EditPictureModal from "../modals/edit-picture-modal/edit-picture-modal";
import { Context } from "../../..";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

interface IPictureListProps {
  userId: number,
  isPersonalGallery: boolean
};

const PictureList = ({ userId, isPersonalGallery }: IPictureListProps) => {
  const { pictureStore } = useContext(Context);

  const [viewPictureModalIsOpen, setViewPictureModalIsOpen] = useState(false);
  const [currentPictureId, setCurrentPictureId] = useState(0);

  const getPictures = useCallback(async () => {
    await pictureStore.getPictures();
  }, [pictureStore]);

  const {
    executeCallback: fetchPictures, isLoading: fetchPicturesLoading
  } = useFetching(getPictures);

  const {
    executeCallback: delayedFetchPictures,
    isLoading: delayedFetchPicturesLoading,
  } = useDelayFetching(getPictures, 500);


  const getPictureListWithCurrentQueryParams = useCallback(async (target?: EventTarget) => {
    if (target instanceof HTMLButtonElement || target instanceof HTMLSelectElement || !target) {
      await fetchPictures();
      return;
    }
    await delayedFetchPictures();

  }, [delayedFetchPictures, fetchPictures]);

  const setPage = async (target: EventTarget, page: number) => {
    runInAction(() => {
      pictureStore.queryParams = { ...pictureStore.queryParams, page }
    })
    getPictureListWithCurrentQueryParams(target);
  }

  useEffect(() => {
    if (userId) {
      runInAction(() => {
        pictureStore.queryParams = { ...pictureStore.queryParams, userId, page: 1 }
      });
      getPictureListWithCurrentQueryParams();
    }
  }, [userId, pictureStore, getPictureListWithCurrentQueryParams]);

  useEffect(() => {
    if (!isPersonalGallery) {
      runInAction(() => {
        pictureStore.queryParams = { ...pictureStore.queryParams, userId: 0, page: 1 }
      });
      getPictureListWithCurrentQueryParams();
    }
  }, []);

  return (
    <article className={`${listStyles["picture-list__wrapper"]} ${fetchPicturesLoading || delayedFetchPicturesLoading ? listStyles["loading-list"] : ""}`}>
      {
        isPersonalGallery ?
          <EditPictureModal isOpen={viewPictureModalIsOpen} setIsOpen={setViewPictureModalIsOpen} currentPictureId={currentPictureId} />
          :
          <ViewPictureModal isOpen={viewPictureModalIsOpen} setIsOpen={setViewPictureModalIsOpen} currentPictureId={currentPictureId} />
      }
      <SearchPanel onChange={getPictureListWithCurrentQueryParams} />
      <section className={listStyles["picture-list"]}>
        {
          pictureStore.pictures.rows.map(pictureItem =>
            <PictureItem key={pictureItem.id} pictureItem={pictureItem} setCurrentPictureId={setCurrentPictureId} setIsOpen={setViewPictureModalIsOpen} />
          )
        }
      </section>
      <PaginationInput
        count={pictureStore.pictures.count}
        limit={pictureStore.queryParams.limit}
        page={pictureStore.queryParams.page}
        setPage={setPage} />
    </article>
  )
};
export default observer(PictureList);