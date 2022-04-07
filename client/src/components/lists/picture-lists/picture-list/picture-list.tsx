import listStyles from "./picture-list.module.css";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import useFetching from "../../../../hooks/useFetching";
import { IGetPicturesResponse } from "../../../../interfaces/http/response/pictureInterfaces";
import PictureService from "../../../../services/picture-service";
import PictureItem from "./picture-item/picture-item";
import SearchPanel from "./search-panel/search-panel";
import useDelayFetching from "../../../../hooks/useDelayFetching";
import PaginationInput from "../../../inputs/pagination-input/pagination-input";

interface IPictureListProps {
  userId: number
};

export interface IQueryParamsObj {
  userId: number,
  queryString: string,
  sort: string[] | string,
  page: number,
  limit: number
};

const PictureList = ({ userId }: IPictureListProps) => {
  const [queryParams, setQueryParams] = useState<IQueryParamsObj>({
    userId: 0,
    queryString: "",
    sort: "",
    page: 1,
    limit: 1
  });

  useEffect(() => {
    setQueryParams({ ...queryParams, userId });
  }, [userId]);

  // const {
  //   executeCallback: getPictures,
  //   isLoading: picturesIsLoading,
  //   response: pictureList
  // } = useFetching<AxiosResponse<IShortPictureObj[]>>(PictureService.getPictures);

  const {
    executeCallback: getPictures,
    isLoading: picturesIsLoading,
    executeResult: pictureList
  } = useDelayFetching<AxiosResponse<IGetPicturesResponse>>(PictureService.getPictures, 500)

  useEffect(() => {
    getPictures(queryParams);
  }, [queryParams]);

  useEffect(() => {
    getPictures();
  }, []);

  return (
    <article className={listStyles["picture-list__wrapper"]}>
      <h1>Picture List</h1>
      <SearchPanel queryParams={queryParams} onChange={setQueryParams} />
      <section className={listStyles["picture-list"]}>
        {
          pictureList && pictureList.data && pictureList.data.rows.map(pictureItem =>
            <PictureItem key={pictureItem.id} pictureItem={pictureItem} />
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