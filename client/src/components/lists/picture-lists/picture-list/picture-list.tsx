import listStyles from "./picture-list.module.css";
import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import useFetching from "../../../../hooks/useFetching";
import { IGetPicturesResponse } from "../../../../interfaces/http/response/pictureInterfaces";
import PictureService from "../../../../services/picture-service";
import PictureItem from "./picture-item/picture-item";
import SearchPanel from "./search-panel/search-panel";
import useDelayFetching from "../../../../hooks/useDelayFetching";
import PaginationInput from "../../../inputs/pagination-input/pagination-input";
import ViewPictureModal from "../../../modal-window/view-picture-modal/view-picture-modal";
import EditPictureModal from "../../../modal-window/edit-picture-modal/edit-picture-modal";

interface IPictureListProps {
  userId: number,
  isPersonalGallery: boolean
};

export interface IQueryParamsObj {
  userId: number,
  queryString: string,
  sort: string[] | string,
  page: number,
  limit: number
};

const PictureList = ({ userId, isPersonalGallery }: IPictureListProps) => {
  const [queryParams, setQueryParams] = useState<IQueryParamsObj>({
    userId: 0,
    queryString: "",
    sort: "",
    page: 1,
    limit: 1
  });

  const [pictureList, setPictureList] = useState<IGetPicturesResponse>()

  const [viewPictureModalIsOpen, setViewPictureModalIsOpen] = useState(false);
  const [currentPictureId, setCurrentPictureId] = useState(0);

  const getPictures = useCallback(async (userId, queryString, sort, page, limit) => {
    const response = await PictureService.getPictures(userId, queryString, sort, page, limit);
    setPictureList(response.data);

    return response;
  }, []);

  const {
    executeCallback: fetchPictures, isLoading: fetchPicturesLoading
  } = useFetching(getPictures);

  const {
    executeCallback: delayedFetchPictures,
    isLoading: delayedFetchPicturesLoading,
  } = useDelayFetching(getPictures, 500);


  const getPictureListWithCurrentQueryParams = useCallback(async (newQueryParamsObj: IQueryParamsObj, delayed: boolean) => {
    console.log(delayed);
    setQueryParams(newQueryParamsObj);
    const paramsArr = Object.values(newQueryParamsObj);

    if (delayed) {
      await delayedFetchPictures(...paramsArr);
      return;
    }

    await fetchPictures(...paramsArr);
  }, [setQueryParams, delayedFetchPictures, fetchPictures]);

  useEffect(() => {
    if (userId) {
      setQueryParams({ ...queryParams, userId });
    }
  }, [userId]);

  useEffect(() => {
    getPictureListWithCurrentQueryParams(queryParams, false);
  }, [userId, getPictureListWithCurrentQueryParams]);

  return (
    <article className={listStyles["picture-list__wrapper"]}>
      {
        isPersonalGallery ?
          <EditPictureModal isOpen={viewPictureModalIsOpen} setIsOpen={setViewPictureModalIsOpen} currentPictureId={currentPictureId} />
          :
          <ViewPictureModal isOpen={viewPictureModalIsOpen} setIsOpen={setViewPictureModalIsOpen} currentPictureId={currentPictureId} />
      }

      <h1>Picture List</h1>
      <SearchPanel queryParams={queryParams} onChange={getPictureListWithCurrentQueryParams} />
      <section className={listStyles["picture-list"]}>
        {
          pictureList?.rows.map(pictureItem =>
            <PictureItem key={pictureItem.id} pictureItem={pictureItem} setCurrentPictureId={setCurrentPictureId} setIsOpen={setViewPictureModalIsOpen} />
          )
        }
      </section>
      <PaginationInput
        count={pictureList?.count}
        limit={queryParams.limit}
        page={queryParams.page}
        setPage={(page: number, delayed: boolean = false) =>
          getPictureListWithCurrentQueryParams({ ...queryParams, page }, delayed)
        } />
    </article>
  )
};
export default PictureList;