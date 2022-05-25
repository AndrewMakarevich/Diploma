import { useCallback, useEffect, useRef, useState } from "react";
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
import useBatching from "../../../hooks/useBatching";

interface IPaginationParams {
  cursor: IGetPictureTypesCursor,
  limit: number
}

const PictureTypesPanel = () => {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const [pictureTypes, setPictureTypes] = useState<IGetPictureTypesResponseObj>({
    count: 0,
    rows: []
  });
  const [locallyAddedPictureTypesIds, setLocallyAddedPictureTypesIds] = useState<number[]>([])
  const [allPictureTypesRecieved, setAllPictureTypesRecieved] = useState<boolean>(false);
  const [pictureTypeToEditId, setPictureTypeToEditId] = useState<number>(0);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [queryString, setQueryString] = useState("");
  const [pagination, setPagination] = useState<IPaginationParams>({
    cursor: { key: "createdAt", id: 0, value: 0, order: "ASC" },
    limit: 1
  });

  const sendRequestToGetPictureTypes = useCallback(async (queryString: string, rewrite = false) => {

    if (!tableWrapperRef.current) {
      return;
    }

    if (!rewrite && allPictureTypesRecieved) {
      return;
    }

    let currentPaginationState = pagination;

    if (rewrite) {
      currentPaginationState = { ...pagination, cursor: { ...pagination.cursor, id: 0, value: 0 } };
      setAllPictureTypesRecieved(false);
    }

    let rewriteCurrentState = rewrite;
    let currentPicturesTypesListState = pictureTypes;

    do {
      const { scrollTop, scrollHeight, clientHeight } = tableWrapperRef.current;
      const { data } = await PictureTypeService.getPicturesTypes(queryString, currentPaginationState.cursor, currentPaginationState.limit);
      const { count, rows } = data;

      if (!rows.length) {
        setAllPictureTypesRecieved(true);
        setTimeout(() => { setAllPictureTypesRecieved(false) }, 1000 * 60)
        break;
      }

      const filteredFromDulicatesTypesArr = rows.filter(type => !locallyAddedPictureTypesIds.some(localTypeId => localTypeId === type.id));

      if (rewriteCurrentState) {
        currentPicturesTypesListState = { count, rows: filteredFromDulicatesTypesArr }
        rewriteCurrentState = false
      } else {
        currentPicturesTypesListState.rows = [...currentPicturesTypesListState.rows, ...filteredFromDulicatesTypesArr];

      }
      setPictureTypes(currentPicturesTypesListState);

      const lastResponseItem = rows[rows.length - 1]
      currentPaginationState = { ...pagination, cursor: { ...pagination.cursor, id: lastResponseItem.id, value: lastResponseItem[pagination.cursor.key] } }
      setPagination(currentPaginationState);

      if ((scrollTop < (scrollHeight - clientHeight)) && !rewrite) {
        break;
      }
    } while (true)
  }, [pagination, pictureTypes, allPictureTypesRecieved, locallyAddedPictureTypesIds])

  const { executeCallback: fetchPictureTypes, isLoading: pictureTypesLoading } = useFetching(sendRequestToGetPictureTypes);
  const { executeCallback: delayFetchPictureTypes, isLoading: delayPictureTypesLoading } = useDelayFetching<void>(sendRequestToGetPictureTypes, 200);

  const getPictureTypesWithCurrentQueryParams = useCallback((queryString: string, target?: EventTarget, rewrite = false) => {
    if (target instanceof HTMLButtonElement || target instanceof HTMLSelectElement || !target) {
      fetchPictureTypes(queryString, rewrite);
      return;
    }

    delayFetchPictureTypes(queryString, rewrite);

  }, [fetchPictureTypes, delayFetchPictureTypes])

  const setQueryStringAndGetPictureTypes = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target?.value);
    getPictureTypesWithCurrentQueryParams(e.target.value, e.target, true);
  }, [getPictureTypesWithCurrentQueryParams]);

  const setSortParamsAndGetPictureTypes = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const keyAndOrder = e.target.value.split(",");
    const key = keyAndOrder[0];
    const order = keyAndOrder[1] === "ASC" || keyAndOrder[1] === "DESC" ? keyAndOrder[1] : "DESC";

    const newPaginationParams: IPaginationParams = { ...pagination, cursor: { ...pagination.cursor, key, order } }
    setPagination(newPaginationParams);

    getPictureTypesWithCurrentQueryParams(queryString, e.target, true);

  }, [getPictureTypesWithCurrentQueryParams, queryString, pagination]);

  const actionsArray = [
    {
      header: "delete",
      clickHandler: async (pictureType: pictureTypeObj) => {
        try {
          if (window.confirm("Are you sure you want to delete this picture type?")) {
            await PictureTypeService.deletePictureType(pictureType.id);
            setPictureTypes({ ...pictureTypes, rows: pictureTypes.rows.filter(type => type.id !== pictureType.id) })
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
      rows: [...pictureTypes.rows, newPictureType]
    });
    setLocallyAddedPictureTypesIds([...locallyAddedPictureTypesIds, newPictureType.id]);
  }

  const infiniteTypesLoading = useCallback(() => {
    if (!tableWrapperRef.current || allPictureTypesRecieved || pictureTypesLoading || delayPictureTypesLoading) {
      return;
    }

    const { scrollHeight, clientHeight, scrollTop } = tableWrapperRef.current;

    if (scrollHeight - clientHeight - scrollTop < 25) {
      fetchPictureTypes(queryString);
    }
  }, [tableWrapperRef, queryString, fetchPictureTypes, pictureTypesLoading, delayPictureTypesLoading, allPictureTypesRecieved])

  const { executeBatch } = useBatching(infiniteTypesLoading);

  useEffect(() => {
    getPictureTypesWithCurrentQueryParams(queryString);
  }, []);

  return (
    <div className={panelStyles["panel-wrapper"]}>
      <PictureTypesSearchPanel setQueryString={setQueryStringAndGetPictureTypes} setSortParam={setSortParamsAndGetPictureTypes} />
      <div className={panelStyles["forms"]}>
        <CreatePictureTypeForm actualizeList={actualizeListAfterAddingType} />
        <EditPictureTypeForm
          initialParams={pictureTypes.rows.find(pictureType => +pictureType.id === +pictureTypeToEditId)}
          isOpen={editFormOpen}
          setIsOpen={setEditFormOpen}
          pictureTypes={pictureTypes}
          setPictureTypes={setPictureTypes} />
      </div>
      <div ref={tableWrapperRef} className={panelStyles["table-wrapper"]} onScroll={executeBatch}>
        <Table<pictureTypeObj>
          tableHeaders={["ID", "Name", "Pictures amount"]}
          entities={pictureTypes.rows}
          paramsToShow={["id", "name", "picturesAmount"]}
          actions={actionsArray} />
      </div>
    </div>
  )
};

export default PictureTypesPanel;