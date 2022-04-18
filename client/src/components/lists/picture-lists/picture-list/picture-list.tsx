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

  const [viewPictureModalIsOpen, setViewPictureModalIsOpen] = useState(false);
  const [currentPictureId, setCurrentPictureId] = useState(0);

  const {
    executeCallback: getPictures,
    isLoading: picturesIsLoading,
    executeResult: pictureList
  } = useDelayFetching<AxiosResponse<IGetPicturesResponse>>(PictureService.getPictures, 500)

  useEffect(() => {
    if (userId) {
      setQueryParams({ ...queryParams, userId });
    }
  }, [userId]);

  useEffect(() => {
    getPictures(queryParams.userId, queryParams.queryString, queryParams.sort, queryParams.page, queryParams.limit);
  }, [queryParams, getPictures]);

  return (
    <article className={listStyles["picture-list__wrapper"]}>
      {
        isPersonalGallery ?
          <EditPictureModal isOpen={viewPictureModalIsOpen} setIsOpen={setViewPictureModalIsOpen} currentPictureId={currentPictureId} />
          :
          <ViewPictureModal isOpen={viewPictureModalIsOpen} setIsOpen={setViewPictureModalIsOpen} currentPictureId={currentPictureId} />
      }

      <h1>Picture List</h1>
      <SearchPanel queryParams={queryParams} onChange={setQueryParams} />
      <section className={listStyles["picture-list"]}>
        {
          pictureList && pictureList.data && pictureList.data.rows.map(pictureItem =>
            <PictureItem key={pictureItem.id} pictureItem={pictureItem} setCurrentPictureId={setCurrentPictureId} setIsOpen={setViewPictureModalIsOpen} />
          )
        }
      </section>
      <PaginationInput
        count={pictureList?.data.count}
        limit={queryParams.limit}
        page={queryParams.page}
        setPage={(page: number) => setQueryParams({ ...queryParams, page })
        } />
    </article>
  )
};
export default PictureList;