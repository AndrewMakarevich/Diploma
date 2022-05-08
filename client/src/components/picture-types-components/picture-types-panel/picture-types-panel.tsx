import { useCallback, useEffect, useState } from "react";
import useFetching from "../../../hooks/useFetching";
import { IGetPictureTypesResponseObj } from "../../../interfaces/http/response/picture-type-interfaces";
import PictureTypeService from "../../../services/picture-type-service";
import PaginationInput from "../../inputs/pagination-input/pagination-input";
import Table from "../../table/table";
import { pictureTypeObj } from "../../../interfaces/http/response/picture-type-interfaces";
import SearchInput from "../../../UI/search-input/search-input";
import useDelayFetching from "../../../hooks/useDelayFetching";
import CreatePictureTypeForm from "../forms/create-picture-type-form/create-picture-type-form";
import EditPictureTypeForm from "../forms/edit-picture-type-form/edit-picture-type-form";

const PictureTypesPanel = () => {
  const [pictureTypes, setPictureTypes] = useState<IGetPictureTypesResponseObj>({
    count: 0,
    rows: []
  });

  const [pictureTypeToEditId, setPictureTypeToEditId] = useState<number>(0);

  const [queryString, setQueryString] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 1
  });

  const [editFormOpen, setEditFormOpen] = useState(false);

  const sendRequestToGetPictureTypes = useCallback(async (queryString: string, page: number, limit: number) => {
    const response = await PictureTypeService.getPicturesTypes(queryString, page, limit);
    setPictureTypes(response.data);
  }, [])

  const { executeCallback: fetchPictureTypes, isLoading: pictureTypesLoading } = useFetching<IGetPictureTypesResponseObj>(sendRequestToGetPictureTypes);
  const { executeCallback: delayFetchPictureTypes, isLoading: delayPictureTypesLoading } = useDelayFetching<IGetPictureTypesResponseObj>(sendRequestToGetPictureTypes, 200);

  const getPictureTypesWithCurrentQueryParams = useCallback(async (queryString: string, page: number, limit: number, target?: EventTarget) => {
    if (target instanceof HTMLButtonElement || target instanceof HTMLSelectElement || !target) {
      await fetchPictureTypes(queryString, page, limit);
      return;
    }

    await delayFetchPictureTypes(queryString, page, limit);

  }, [fetchPictureTypes, delayFetchPictureTypes])

  const setPage = useCallback((target: EventTarget, page: number) => {
    setPagination({ ...pagination, page });
    getPictureTypesWithCurrentQueryParams(queryString, page, pagination.limit, target)
  }, [pagination, getPictureTypesWithCurrentQueryParams, queryString])

  const setQueryStringAndGetPictureTypes = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target?.value)
    getPictureTypesWithCurrentQueryParams(e.target.value, pagination.page, pagination.limit, e.target);
  }, [getPictureTypesWithCurrentQueryParams, pagination]);

  const actionsArray = [
    {
      header: "delete",
      clickHandler: async (pictureType: pictureTypeObj) => {
        try {
          if (window.confirm("Are you sure you want to delete this picture type?")) {
            await PictureTypeService.deletePictureType(pictureType.id);
            getPictureTypesWithCurrentQueryParams(queryString, 1, pagination.limit);
          }
        } catch (e: any) {
          alert(e.isAxiosError ? e.response.data.message : e.message);
        }
      }
    },
    {
      header: "edit",
      clickHandler: (pictureType: pictureTypeObj) => {
        setPictureTypeToEditId(pictureType.id);
        if (!editFormOpen) {
          setEditFormOpen(true);
        }
      }
    }
  ]

  const actualizeListAfterAddingType = (newPictureType: pictureTypeObj) => {
    setPictureTypes({
      ...pictureTypes,
      count: pictureTypes.count + 1,
      rows: [newPictureType, ...pictureTypes.rows.splice(-1, 1)]
    })

  }


  useEffect(() => {
    getPictureTypesWithCurrentQueryParams(queryString, pagination.page, pagination.limit);
  }, []);

  return (
    <>
      <SearchInput onChange={setQueryStringAndGetPictureTypes} />
      <CreatePictureTypeForm actualizeList={actualizeListAfterAddingType} />
      <EditPictureTypeForm
        initialParams={pictureTypes.rows.find(pictureType => +pictureType.id === +pictureTypeToEditId) || { id: 0, name: "", userId: 0 }}
        isOpen={editFormOpen}
        setIsOpen={setEditFormOpen}
        pictureTypes={pictureTypes}
        setPictureTypes={setPictureTypes} />
      <Table<pictureTypeObj> tableHeaders={["ID", "Name"]} entities={pictureTypes.rows} paramsToShow={["id", "name"]} actions={actionsArray} />
      <PaginationInput page={pagination.page} limit={pagination.limit} count={pictureTypes.count} setPage={setPage} />
    </>
  )
};

export default PictureTypesPanel;