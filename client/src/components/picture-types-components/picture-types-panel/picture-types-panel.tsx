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
import PictureTypeSortSelect from "../inputs/picture-type-sort-select/picture-type-sort-select";

import panelStyles from "./picture-types-panel.module.css";
import PictureTypesSearchPanel from "../picture-types-search-panel/picture-types-search-panel";

interface IGetPictureTypes {
  func: (queryString: string, sort: string[], page: number, limit: number) => Promise<void>
}

const PictureTypesPanel = () => {
  const [pictureTypes, setPictureTypes] = useState<IGetPictureTypesResponseObj>({
    count: 0,
    rows: []
  });

  const [pictureTypeToEditId, setPictureTypeToEditId] = useState<number>(0);

  const [queryString, setQueryString] = useState("");
  const [sortParam, setSortParam] = useState(["createdAt", "DESC"]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5
  });

  const [editFormOpen, setEditFormOpen] = useState(false);

  const sendRequestToGetPictureTypes = useCallback(async (queryString: string, sort: string[], page: number, limit: number) => {
    const response = await PictureTypeService.getPicturesTypes(queryString, sort, page, limit);
    setPictureTypes(response.data);
  }, [])

  const { executeCallback: fetchPictureTypes, isLoading: pictureTypesLoading } = useFetching<void, IGetPictureTypes["func"]>(sendRequestToGetPictureTypes);
  const { executeCallback: delayFetchPictureTypes, isLoading: delayPictureTypesLoading } = useDelayFetching<void>(sendRequestToGetPictureTypes, 200);

  const getPictureTypesWithCurrentQueryParams = useCallback(async (queryString: string, sort: string[], page: number, limit: number, target?: EventTarget) => {
    if (target instanceof HTMLButtonElement || target instanceof HTMLSelectElement || !target) {
      await fetchPictureTypes(queryString, sort, page, limit);
      return;
    }

    await delayFetchPictureTypes(queryString, sort, page, limit);

  }, [fetchPictureTypes, delayFetchPictureTypes])

  const setPage = useCallback((target: EventTarget, page: number) => {
    setPagination({ ...pagination, page });
    getPictureTypesWithCurrentQueryParams(queryString, sortParam, page, pagination.limit, target)
  }, [pagination, getPictureTypesWithCurrentQueryParams, queryString, sortParam])

  const setQueryStringAndGetPictureTypes = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target?.value)
    getPictureTypesWithCurrentQueryParams(e.target.value, sortParam, pagination.page, pagination.limit, e.target);
  }, [getPictureTypesWithCurrentQueryParams, pagination, sortParam]);

  const setSortParamsAndGetPictureTypes = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortParam(e.target.value.split(","));
    getPictureTypesWithCurrentQueryParams(queryString, e.target.value.split(","), pagination.page, pagination.limit, e.target);

  }, [getPictureTypesWithCurrentQueryParams, queryString, pagination]);

  const actionsArray = [
    {
      header: "delete",
      clickHandler: async (pictureType: pictureTypeObj) => {
        try {
          if (window.confirm("Are you sure you want to delete this picture type?")) {
            await PictureTypeService.deletePictureType(pictureType.id);
            getPictureTypesWithCurrentQueryParams(queryString, sortParam, 1, pagination.limit);
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
    if (pagination.limit > pictureTypes.rows.length) {
      setPictureTypes({
        count: pictureTypes.count + 1,
        rows: [newPictureType, ...pictureTypes.rows]
      });
      return;
    }

    setPictureTypes({
      count: pictureTypes.count + 1,
      rows: [newPictureType, ...pictureTypes.rows.slice(0, pictureTypes.rows.length - 1)]
    })

  }


  useEffect(() => {
    getPictureTypesWithCurrentQueryParams(queryString, sortParam, pagination.page, pagination.limit);
  }, []);

  return (
    <div className={panelStyles["panel-wrapper"]}>
      <PictureTypesSearchPanel setQueryString={setQueryStringAndGetPictureTypes} setSortParam={setSortParamsAndGetPictureTypes} />
      <div className={panelStyles["forms"]}>
        <CreatePictureTypeForm actualizeList={actualizeListAfterAddingType} />
        <EditPictureTypeForm
          initialParams={
            pictureTypes.rows.find(pictureType => +pictureType.id === +pictureTypeToEditId)
            || { id: 0, name: "", userId: 0, picturesAmount: 0, createdAt: "", updatedAt: "" }}
          isOpen={editFormOpen}
          setIsOpen={setEditFormOpen}
          pictureTypes={pictureTypes}
          setPictureTypes={setPictureTypes} />
      </div>
      <Table<pictureTypeObj>
        className={panelStyles["table"]}
        tableHeaders={["ID", "Name", "Pictures amount"]}
        entities={pictureTypes.rows}
        paramsToShow={["id", "name", "picturesAmount"]}
        actions={actionsArray} />
      <PaginationInput page={pagination.page} limit={pagination.limit} count={pictureTypes.count} setPage={setPage} />
    </div>
  )
};

export default PictureTypesPanel;