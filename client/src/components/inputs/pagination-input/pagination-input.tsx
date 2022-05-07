import { useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";
import inputStyles from "./pagination-input.module.css";

interface IPaginationInput {
  count: number | undefined,
  limit: number,
  page: number,
  setPage: (target: EventTarget, page: number) => void
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
    createCurrentPaginationLineState()
  }, [pages, page]);

  return (
    <div className={inputStyles["pagination-line"]}>
      <input
        className={inputStyles["custom-page-input"]}
        placeholder="Enter your page"
        title="Enter page number"
        disabled={pages.length <= 1 ? true : false}
        onChange={(e) => {
          if (pages.length === 1) {
            return;
          }
          const typedPage = Number(e.target.value);
          if (typedPage >= pages[0]
            &&
            typedPage <= pages[pages.length - 1]
            &&
            typedPage !== page) {
            setPage(e.target, typedPage);
          }
        }}>

      </input>
      <button className={inputStyles["pagination-line__btn"]}
        disabled={pages.length <= 1 ? true : false}
        onClick={
          (e) => {
            if (pages.length <= 1) {
              return;
            }

            if (page > 1) {
              setPage(e.target, page - 1);
              return;
            }

            setPage(e.target, pages[pages.length - 1])
          }
        }>{"<"}</button>
      {
        currentPaginationState.map(({ id, pageNumber }) =>
          <button key={id} className={`${inputStyles["pagination-line__btn"]} ${pageNumber == page ? inputStyles["active"] : ""}`}
            disabled={pages.length <= 1 ? true : false}
            onClick={(e) => {
              if (pageNumber == page) {
                return;
              }

              if (Number(pageNumber)) {
                setPage(e.target, pageNumber)
              }
            }
            }>{pageNumber}</button>
        )
      }
      <button className={inputStyles["pagination-line__btn"]}
        disabled={pages.length <= 1 ? true : false}
        onClick={
          (e) => {
            if (pages.length <= 1) {
              return;
            }

            if (page < pages.length) {
              setPage(e.target, page + 1);
              return;
            }
            setPage(e.target, pages[0])
          }
        }>{">"}</button>
    </div>
  )
};

export default PaginationInput;