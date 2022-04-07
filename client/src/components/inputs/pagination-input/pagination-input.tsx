import { useEffect, useMemo, useState } from "react";
import inputStyles from "./pagination-input.module.css";

interface IPaginationInput {
  count: number | undefined,
  limit: number,
  page: number,
  setPage: Function
}

const PaginationInput = ({ count, limit, page, setPage }: IPaginationInput) => {
  const [currentPaginationState, setCurrentPaginationState] = useState<Array<number | string>>([]);

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
    setCurrentPaginationState(paginationLineArr);
  }

  const pages = useMemo(() => createPagesArr(count, limit), [count, limit]);

  useEffect(() => {
    setPage(1);
  }, [count]);

  useEffect(() => {
    createCurrentPaginationLineState()
  }, [pages]);

  useEffect(() => {
    createCurrentPaginationLineState()
  }, [page]);

  return (
    <div className={inputStyles["pagination-line"]}>
      <button className={inputStyles["pagination-line__btn"]}
        onClick={
          () => { if (page > 1) setPage(page - 1) }
        }>{"<"}</button>
      {
        currentPaginationState.map(pageItem =>
          <button className={`${inputStyles["pagination-line__btn"]} ${pageItem == page ? inputStyles["active"] : ""}`}
            onClick={() => {
              if (Number(pageItem)) {
                setPage(pageItem)
              }
            }
            }>{pageItem}</button>
        )
      }
      <button className={inputStyles["pagination-line__btn"]}
        onClick={
          () => {
            if (page < pages.length) setPage(page + 1)
          }
        }>{">"}</button>
    </div>
  )
};

export default PaginationInput;