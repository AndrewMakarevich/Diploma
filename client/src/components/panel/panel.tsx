import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import useDelayFetching from "../../hooks/useDelayFetching";
import useFetching from "../../hooks/useFetching";
import { ICursor } from "../../interfaces/pagination";
import { IField } from "../forms/root-form/interfaces";
import StandartOneColumnForm from "../forms/standart-one-column-form/standart-one-column-form";
import SearchPanel, { ISearchPanelInputField, ISearchPanelSelectField } from "../search-panel/search-panel";
import { IAction } from "../table/interfaces";
import Table from "../table/table";

import panelStyles from "./panel.module.css";

interface IPanelProps<T> {
  searchPanelFields: ISearchPanelInputField[] | ISearchPanelSelectField[],
  createEssenceFormFields: IField[],
  editEssenceFormFields: IField[],
  tableActions: IAction[],
  getEssences: (queryString: string, cursor: ICursor, limit: number) => Promise<T[]>,

}

interface IPaginationParams {
  limit: number,
  cursor: ICursor
}

interface IEssence {
  [key: string]: any,
  id: number
}

const Panel = <T extends IEssence,>({ searchPanelFields, createEssenceFormFields, editEssenceFormFields, tableActions, getEssences }: IPanelProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [queryString, setQueryString] = useState("");
  const [paginationParams, setPaginationParams] = useState<IPaginationParams>({
    limit: 5,
    cursor: {
      id: 0,
      key: "createdAt",
      value: 0,
      order: "ASC"
    }
  });
  const [essences, setEssences] = useState<T[]>([]);
  // const [essenceToEditId, setEssenceToEditId] = useState([])
  const [allEssencesRecieved, setAllEssencesRecieved] = useState(false);
  // const [locallyCreatedEssencesIds, setLocallyCreatedEssencesIds] = useState<number[]>([]);
  // const [editFormOpen, setEditFormOpen] = useState(false);

  const getEssencesWhileContainerNotFilled = useCallback(async (rewrite = false) => {
    let preventer = 0;

    if (!tableContainerRef.current) {
      return;
    }

    let cursorState = paginationParams.cursor;
    let essencesState = essences;
    let rewriteState = rewrite;

    do {
      const essencesArr = await getEssences(queryString, cursorState, paginationParams.limit);

      if (!essencesArr || essencesArr.length === 0) {
        setAllEssencesRecieved(true);
        setTimeout(() => setAllEssencesRecieved(true), 1000 * 60);
        break;
      }

      if (rewriteState) {
        rewriteState = false;
        essencesState = essencesArr;
      } else {
        essencesState = [...essencesState, ...essencesArr];
      }
      setEssences(essencesState);

      const lastEssencesElement = essencesArr[essencesArr.length - 1];
      cursorState = { ...cursorState, id: lastEssencesElement.id, value: lastEssencesElement[cursorState.key] }

      const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;

      if (scrollHeight - clientHeight - scrollTop >= 25) {
        break;
      }

      preventer++;
    } while (preventer < 100)
  }, [paginationParams, essences, getEssences, queryString]);

  const { executeCallback: fetchEssences, isLoading: fetchEssencesLoading } = useFetching(getEssencesWhileContainerNotFilled);
  const { executeCallback: delayFetchEssences, isLoading: delayFetchEssencesLoading } = useDelayFetching(getEssencesWhileContainerNotFilled, 400);

  const getEssencesBasedOnElementType = useCallback((event: ChangeEvent<HTMLInputElement>, rewrite = false) => {
    if (event.target instanceof HTMLInputElement) {
      delayFetchEssences(rewrite);
      return;
    }

    fetchEssences(rewrite);
  }, [delayFetchEssences, fetchEssences]);

  const onQueryStringChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQueryString(event.target.value)
  }, []);

  useEffect(() => {
    delayFetchEssences(true);
  }, [queryString])

  return (
    <>
      <SearchPanel fields={searchPanelFields} />
      <div className={panelStyles["forms"]}>
        {/* <StandartOneColumnForm fields={createEssenceFormFields} disabled={ } onClearChanges={ } onSubmit={ } submitButtonText="Create" />
        <StandartOneColumnForm fields={editEssenceFormFields} disabled={ } onClearChanges={ } onSubmit={ } submitButtonText="Create" /> */}
      </div>
      {/* <div ref={tableContainerRef} className={panelStyles["container"]} onScroll={infiniteLoading}>
        <Table tableHeaders={["ID", "Text", "Attached pictures amount"]} paramsToShow={["id", "text", "attachedPicturesAmount"]} entities={essences} actions={tableActions} />
      </div> */}
    </>
  )
};

export default Panel;