import { useCallback, useEffect, useState } from "react";
import useFetching from "../../../hooks/useFetching";
import { IGetPictureTypesResponseObj } from "../../../interfaces/http/response/picture-type-interfaces";
import PictureTypeService from "../../../services/picture-type-service";
import Table from "../../table/table";
import { pictureTypeObj } from "../../../interfaces/http/response/picture-type-interfaces";
import useDelayFetching from "../../../hooks/useDelayFetching";
import CreatePictureTypeForm from "../forms/create-picture-type-form/create-picture-type-form";
import EditPictureTypeForm from "../forms/edit-picture-type-form/edit-picture-type-form";

import panelStyles from "./picture-types-panel.module.css";
import PictureTypesSearchPanel from "../picture-types-search-panel/picture-types-search-panel";
import { IGetPictureTypesCursor } from "../../../interfaces/services/pictureTypeServiceInterfaces";

const PictureTypesPanel = () => {
  const [pictureTypes, setPictureTypes] = useState<IGetPictureTypesResponseObj>({
    count: 0,
    rows: []
  });

  const [pictureTypeToEditId, setPictureTypeToEditId] = useState<number>(0);

  const [queryString, setQueryString] = useState("");
  const [pagination, setPagination] = useState({
    cursor: { key: "createdAt", id: 0, value: 0, order: "DESC" },
    limit: 5
  });

  const [editFormOpen, setEditFormOpen] = useState(false);

  const sendRequestToGetPictureTypes = useCallback(async (queryString: string, cursor: IGetPictureTypesCursor, limit: number) => {
    const response = await PictureTypeService.getPicturesTypes(queryString, cursor, limit);
    setPictureTypes(response.data);
  }, [])

  const { executeCallback: fetchPictureTypes, isLoading: pictureTypesLoading } = useFetching(sendRequestToGetPictureTypes);
  const { executeCallback: delayFetchPictureTypes, isLoading: delayPictureTypesLoading } = useDelayFetching<void>(sendRequestToGetPictureTypes, 200);

  const getPictureTypesWithCurrentQueryParams = useCallback(async (queryString: string, cursor: IGetPictureTypesCursor, limit: number, target?: EventTarget) => {
    if (target instanceof HTMLButtonElement || target instanceof HTMLSelectElement || !target) {
      await fetchPictureTypes(queryString, cursor, limit);
      return;
    }

    await delayFetchPictureTypes(queryString, cursor, limit);

  }, [fetchPictureTypes, delayFetchPictureTypes])

  const setQueryStringAndGetPictureTypes = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target?.value)
    getPictureTypesWithCurrentQueryParams(e.target.value, pagination.cursor as IGetPictureTypesCursor, pagination.limit, e.target);
  }, [getPictureTypesWithCurrentQueryParams, pagination]);

  const setSortParamsAndGetPictureTypes = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPaginationParams = { ...pagination, cursor: { ...pagination.cursor, key: e.target.value.split(",")[1], order: e.target.value.split(",")[0] } }
    setPagination(newPaginationParams);

    getPictureTypesWithCurrentQueryParams(queryString, newPaginationParams.cursor as IGetPictureTypesCursor, newPaginationParams.limit, e.target);

  }, [getPictureTypesWithCurrentQueryParams, queryString, pagination]);

  const actionsArray = [
    {
      header: "delete",
      clickHandler: async (pictureType: pictureTypeObj) => {
        try {
          if (window.confirm("Are you sure you want to delete this picture type?")) {
            await PictureTypeService.deletePictureType(pictureType.id);
            getPictureTypesWithCurrentQueryParams(queryString, pagination.cursor as IGetPictureTypesCursor, pagination.limit);
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
      count: pictureTypes.count + 1,
      rows:
        pagination.limit > pictureTypes.rows.length ?
          [newPictureType, ...pictureTypes.rows] :
          [newPictureType, ...pictureTypes.rows.slice(0, pictureTypes.rows.length - 1)]
    })
  }


  useEffect(() => {
    getPictureTypesWithCurrentQueryParams(queryString, pagination.cursor as IGetPictureTypesCursor, pagination.limit);
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
      <div>
        <Table<pictureTypeObj>
          className={panelStyles["table"]}
          tableHeaders={["ID", "Name", "Pictures amount"]}
          entities={pictureTypes.rows}
          paramsToShow={["id", "name", "picturesAmount"]}
          actions={actionsArray} />
      </div>
    </div>
  )
};

export default PictureTypesPanel;