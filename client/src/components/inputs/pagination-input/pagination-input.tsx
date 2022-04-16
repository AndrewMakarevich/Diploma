import { useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";
import inputStyles from "./pagination-input.module.css";

interface IPaginationInput {
  count: number | undefined,
  limit: number,
  page: number,
  setPage: Function
}

const PaginationInput = ({ count, limit, page, setPage }: IPaginationInput) => {
  const [currentPaginationState, setCurrentPaginationState] = useState<Array<{ id: string, pageNumber: number }>>([]);

  function createPagesArr(count: number = 0, limit: number) {

    const pagesArr = [];
    const pagesAmount = Math.ceil(count / limit);
    for (let i = 1; i <= pagesAmount; i++) {
      pagesArr.push(i)
    }
    return pagesArr;
  }

  function createCurrentPaginationLineState() {
    let paginationLineArr: any[] = [];
    if (pages.length <= 6) {
      paginationLineArr = pages;
    } else {
      if (page <= 4) {
        paginationLineArr = pages.slice(0, 5);
        paginationLineArr.push("...");
        paginationLineArr.push(pages[pages.length - 1]);
      }
      else if (page > pages.length - 4) {
        paginationLineArr.push(pages[0]);
        paginationLineArr.push("...");
        paginationLineArr = [...paginationLineArr, ...pages.slice(-5)];
      } else {
        paginationLineArr.push(pages[0]);
        paginationLineArr.push("...");
        paginationLineArr.push(pages[page - 2]);
        paginationLineArr.push(pages[page - 1]);
        paginationLineArr.push(pages[page]);
        paginationLineArr.push("...");
        paginationLineArr.push(pages[pages.length - 1]);
      }
    }

    paginationLineArr = paginationLineArr.map(item => ({ id: v4(), pageNumber: item }));
    setCurrentPaginationState(paginationLineArr);
  }

  const pages = useMemo(() => createPagesArr(count, limit), [count, limit]);

  useEffect(() => {
    setPage(1);
  }, [count]);

  useEffect(() => {
    createCurrentPaginationLineState()
  }, [pages, page]);

  return (
    <div className={inputStyles["pagination-line"]}>
      <button className={inputStyles["pagination-line__btn"]}
        onClick={
          () => {
            if (page > 1) {
              setPage(page - 1);
              return;
            }
            setPage(pages[pages.length - 1])
          }
        }>{"<"}</button>
      {
        currentPaginationState.map(({ id, pageNumber }) =>
          <button key={id} className={`${inputStyles["pagination-line__btn"]} ${pageNumber == page ? inputStyles["active"] : ""}`}
            onClick={() => {
              if (Number(pageNumber)) {
                setPage(pageNumber)
              }
            }
            }>{pageNumber}</button>
        )
      }
      <button className={inputStyles["pagination-line__btn"]}
        onClick={
          () => {
            if (page < pages.length) {
              setPage(page + 1);
              return;
            }
            setPage(pages[0])
          }
        }>{">"}</button>
    </div>
  )
};

export default PaginationInput;