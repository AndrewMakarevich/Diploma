import React, { useMemo } from "react";
import { v4 } from "uuid";
import inputStyles from "./pagination-input.module.css";

interface IPaginationInput {
  count: number,
  limit: number,
  page: number,
  setPage: (target: EventTarget, page: number) => void
}

const PaginationInput = ({ count, limit, page, setPage }: IPaginationInput) => {
  const pages = useMemo(() => {
    const pagesArr = [];
    const pagesAmount = Math.ceil(count / limit);
    for (let i = 1; i <= pagesAmount; i++) {
      pagesArr.push(i)
    }
    return pagesArr;
  }, [count, limit]);

  const currentPaginationState = useMemo(() => {
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
    return paginationLineArr;
  }, [pages, page]);

  const setCustomPage = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const setPrevPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (pages.length <= 1) {
      return;
    }

    if (page > 1) {
      setPage(e.target, page - 1);
      return;
    }

    setPage(e.target, pages[pages.length - 1])
  };

  const setCurrentPage = (pageNumber: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (+pageNumber === +page) {
      return;
    }

    if (Number(pageNumber)) {
      setPage(e.target, pageNumber)
    }
  };

  const setNextPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (pages.length <= 1) {
      return;
    }

    if (page < pages.length) {
      setPage(e.target, page + 1);
      return;
    }
    setPage(e.target, pages[0])
  };

  return (
    <div className={inputStyles["pagination-line"]}>
      <input
        className={inputStyles["custom-page-input"]}
        placeholder="Enter your page"
        title="Enter page number"
        disabled={pages.length <= 1 ? true : false}
        onChange={setCustomPage}>

      </input>
      <button className={inputStyles["pagination-line__btn"]}
        disabled={pages.length <= 1 ? true : false}
        onClick={setPrevPage}>{"<"}</button>
      {
        currentPaginationState.map(({ id, pageNumber }) =>
          <button key={id} className={`${inputStyles["pagination-line__btn"]} ${pageNumber == page ? inputStyles["active"] : ""}`}
            disabled={pages.length <= 1 ? true : false}
            onClick={setCurrentPage(pageNumber)}>{pageNumber}</button>
        )
      }
      <button className={inputStyles["pagination-line__btn"]}
        disabled={pages.length <= 1 ? true : false}
        onClick={setNextPage}>{">"}</button>
    </div>
  )
}
export default PaginationInput;