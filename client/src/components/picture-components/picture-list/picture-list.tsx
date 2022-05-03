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


  const getPictureListWithCurrentQueryParams = useCallback(async (delayed: boolean) => {
    if (delayed) {
      await delayedFetchPictures();
      return;
    }

    await fetchPictures();
  }, [delayedFetchPictures, fetchPictures]);

  useEffect(() => {
    runInAction(() => {
      pictureStore.queryParams = { ...pictureStore.queryParams, userId }
    });
    if (userId) {
      getPictureListWithCurrentQueryParams(false);
    }
  }, [userId, pictureStore, getPictureListWithCurrentQueryParams]);

  useEffect(() => {
    if (!isPersonalGallery) {
      getPictureListWithCurrentQueryParams(false);
    }
  }, []);

  if (fetchPicturesLoading || delayedFetchPictures) {

  }

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
        setPage={(page: number, delayed: boolean = false) => {
          runInAction(() => {
            pictureStore.queryParams = { ...pictureStore.queryParams, page }
          })

          getPictureListWithCurrentQueryParams(delayed)
        }} />
    </article>
  )
};
export default observer(PictureList);