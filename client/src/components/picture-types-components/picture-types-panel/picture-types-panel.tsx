import { useCallback, useMemo, useState } from "react";
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
import InfiniteScroll from "../../infinite-scroll/infinite-scroll";

interface IPaginationParams {
  cursor: IGetPictureTypesCursor,
  limit: number
}

const PictureTypesPanel = () => {
  const [pictureTypes, setPictureTypes] = useState<IGetPictureTypesResponseObj>({
    count: 0,
    rows: []
  });
  const [locallyAddedPictureTypesIds, setLocallyAddedPictureTypesIds] = useState<number[]>([])
  const [allPictureTypesRecieved, setAllPictureTypesRecieved] = useState<boolean>(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [queryString, setQueryString] = useState("");
  const [pagination, setPagination] = useState<IPaginationParams>({
    cursor: { key: "createdAt", id: 0, value: 0, order: "ASC" },
    limit: 1
  });
  const [rewriteTypes, setRewriteTypes] = useState(false);
  const [pictureTypeToEditId, setPictureTypeToEditId] = useState<number>(0);
  const picturetTypeToEdit = useMemo(() => pictureTypes.rows.find(pictureType => +pictureType.id === +pictureTypeToEditId), [pictureTypeToEditId, pictureTypes]);

  const getTypes = useCallback(async (rewrite: boolean, unmountFlag: React.MutableRefObject<boolean>) => {
    const { cursor, limit } = pagination;
    if (rewrite) {
      cursor.id = 0;
      cursor.value = 0;
      setAllPictureTypesRecieved(false);
    }

    const { data } = await PictureTypeService.getPicturesTypes(queryString, cursor, limit);

    if (unmountFlag.current) {
      setAllPictureTypesRecieved(true);
      return
    }

    const { count, rows } = data;

    if (!rows.length) {
      setAllPictureTypesRecieved(true);
      setTimeout(() => { setAllPictureTypesRecieved(false) }, 1000 * 60)
    }

    const filteredFromDulicatesTypesArr = rows.filter(type => !locallyAddedPictureTypesIds.some(localTypeId => localTypeId === type.id));

    if (rewrite) {
      setPictureTypes({ count, rows: filteredFromDulicatesTypesArr })
      setRewriteTypes(false);
    } else {
      setPictureTypes({ ...pictureTypes, rows: [...pictureTypes.rows, ...filteredFromDulicatesTypesArr] });
    }

    const lastResponseItem = rows[rows.length - 1]
    setPagination({ ...pagination, cursor: { ...cursor, id: lastResponseItem.id, value: lastResponseItem[cursor.key] } });
  }, [pagination, queryString, locallyAddedPictureTypesIds, pictureTypes]);

  const setRewriteStateToTrue = useCallback(async () => {
    setRewriteTypes(true);
  }, [])

  const { executeCallback: delaySetRewriteState } = useDelayFetching(setRewriteStateToTrue, 400);

  const setQueryStringAndGetPictureTypes = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target.value);
    delaySetRewriteState();
  }, [delaySetRewriteState]);

  const setSortParamsAndGetPictureTypes = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const keyAndOrder = JSON.parse(e.target.value);
    const key = keyAndOrder[0];
    const order = keyAndOrder[1] === "ASC" || keyAndOrder[1] === "DESC" ? keyAndOrder[1] : "DESC";

    setPagination({ ...pagination, cursor: { ...pagination.cursor, key, order } });
    setRewriteTypes(true);
  }, [pagination, setRewriteTypes]);

  const onDeletePictureType = useCallback(async (pictureType: pictureTypeObj) => {
    try {
      if (window.confirm("Are you sure you want to delete this picture type?")) {
        await PictureTypeService.deletePictureType(pictureType.id);
        setPictureTypes({ ...pictureTypes, rows: pictureTypes.rows.filter(type => type.id !== pictureType.id) })
      }
    } catch (e: any) {
      alert(e.isAxiosError ? e.response.data.message : e.message);
    }
  }, [pictureTypes]);

  const openEditPanel = useCallback((pictureType: pictureTypeObj) => {
    setPictureTypeToEditId(pictureType.id);
    if (!editFormOpen) {
      setEditFormOpen(true);
    }
  }, [editFormOpen]);

  const actionsArray = useMemo(() => [
    {
      header: "delete",
      clickHandler: onDeletePictureType
    },
    {
      header: "edit",
      clickHandler: openEditPanel
    }
  ], [onDeletePictureType, openEditPanel])

  const actualizeListAfterAddingType = (newPictureType: pictureTypeObj) => {
    setPictureTypes({
      count: pictureTypes.count + 1,
      rows: [...pictureTypes.rows, newPictureType]
    });
    setLocallyAddedPictureTypesIds([...locallyAddedPictureTypesIds, newPictureType.id]);
  }

  return (
    <>
      <PictureTypesSearchPanel setQueryString={setQueryStringAndGetPictureTypes} setSortParam={setSortParamsAndGetPictureTypes} />
      <div className={panelStyles["forms"]}>
        <CreatePictureTypeForm actualizeList={actualizeListAfterAddingType} />
        {
          Boolean(editFormOpen) &&
          Boolean(picturetTypeToEdit) &&
          <EditPictureTypeForm
            initialParams={picturetTypeToEdit!}
            isOpen={editFormOpen}
            setIsOpen={setEditFormOpen}
            pictureTypes={pictureTypes}
            setPictureTypes={setPictureTypes} />
        }

      </div>
      <InfiniteScroll callback={getTypes} stopValue={allPictureTypesRecieved} rewrite={rewriteTypes}>
        <Table<pictureTypeObj>
          tableHeaders={["ID", "Name", "Pictures amount"]}
          entities={pictureTypes.rows}
          paramsToShow={["id", "name", "picturesAmount"]}
          actions={actionsArray} />
      </InfiniteScroll>
    </>
  )
};

export default PictureTypesPanel;