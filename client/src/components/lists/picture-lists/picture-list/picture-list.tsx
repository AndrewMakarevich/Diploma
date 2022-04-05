import listStyles from "./picture-list.module.css";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import useFetching from "../../../../hooks/useFetching";
import { IShortPictureObj } from "../../../../interfaces/http/response/pictureInterfaces";
import PictureService from "../../../../services/picture-service";
import PictureItem from "./picture-item/picture-item";
import SearchPanel from "./search-panel/search-panel";
import useDelayFetching from "../../../../hooks/useDelayFetching";

interface IPictureListProps {
  userId: number
};

export interface IQueryParamsObj {
  userId: number,
  queryString: string,
  sort: string[] | "",
  page: number,
  limit: number
};

const PictureList = ({ userId }: IPictureListProps) => {
  const [queryParams, setQueryParams] = useState<IQueryParamsObj>({
    userId: 0,
    queryString: "",
    sort: "",
    page: 0,
    limit: 0
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
  } = useDelayFetching<AxiosResponse<IShortPictureObj[]>>(PictureService.getPictures, 1000)

  useEffect(() => {
    getPictures(queryParams);
  }, [queryParams]);

  useEffect(() => {
    getPictures();
  }, []);
  return (
    <>
      <h1>Picture List</h1>
      <SearchPanel queryParams={queryParams} onChange={setQueryParams} />
      <article className={listStyles["picture-list"]}>
        {
          pictureList && pictureList.data && pictureList.data.map(pictureItem =>
            <PictureItem key={pictureItem.id} pictureItem={pictureItem} />
          )
        }
      </article>
    </>
  )
};
export default PictureList;