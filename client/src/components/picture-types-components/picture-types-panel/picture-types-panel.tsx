import { useEffect, useState } from "react";
import useFetching from "../../../hooks/useFetching";
import { IGetPictureTypesResponseObj } from "../../../interfaces/http/response/picture-type-interfaces";
import PictureTypeService from "../../../services/picture-type-service";
import PaginationInput from "../../inputs/pagination-input/pagination-input";
import Table from "../../table/table";
import { pictureTypeObj } from "../../../interfaces/http/response/picture-type-interfaces";
import SearchInput from "../../../UI/search-input/search-input";
import useDelayFetching from "../../../hooks/useDelayFetching";

const PictureTypesPanel = () => {
  const [pictureTypes, setPictureTypes] = useState<IGetPictureTypesResponseObj>({
    count: 0,
    rows: []
  });

  const [queryString, setQueryString] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 1
  });

  const sendRequestToGetPictureTypes = async (queryString: string, page: number, limit: number) => {
    const response = await PictureTypeService.getPicturesTypes(queryString, page, limit);
    setPictureTypes(response.data);
  }

  const setPage = (target: EventTarget, page: number) => {
    setPagination({ ...pagination, page });
    getPictureTypesWithCurrentQueryString(queryString, pagination.page, pagination.limit, target)
  }

  const { executeCallback: fetchPictureTypes, isLoading: pictureTypesLoading } = useFetching<IGetPictureTypesResponseObj>(sendRequestToGetPictureTypes);
  const { executeCallback: delayFetchPictureTypes, isLoading: delayPictureTypesLoading } = useDelayFetching<IGetPictureTypesResponseObj>(sendRequestToGetPictureTypes, 200);

  const getPictureTypesWithCurrentQueryString = async (queryString: string, page: number, limit: number, target?: EventTarget) => {
    if (target instanceof HTMLButtonElement || target instanceof HTMLSelectElement || !target) {
      await fetchPictureTypes(queryString, page, limit);
      return;
    }

    await delayFetchPictureTypes(queryString, page, limit);

  }

  const setQueryStringAndGetPictureTypes = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target?.value)
    getPictureTypesWithCurrentQueryString(e.target.value, pagination.page, pagination.limit, e.target);
  }

  useEffect(() => {
    fetchPictureTypes();
  }, []);

  return (
    <>
      <SearchInput onChange={setQueryStringAndGetPictureTypes} />
      <Table<pictureTypeObj> tableHeaders={["ID", "Name"]} entities={pictureTypes.rows} paramsToShow={["id", "name"]} actions={[]} />
      <PaginationInput page={pagination.page} limit={pagination.limit} count={pictureTypes.count} setPage={setPage} />
    </>
  )
};

export default PictureTypesPanel;