import panelStyles from "./search-panel.module.css";
import SearchInput from "../../../../../UI/search-input/search-input";
import PictureSortSelect from "../../../../inputs/picture-sort-select/picture-sort-select";
import { IQueryParamsObj } from "../picture-list";

interface ISearchPanelProps {
  queryParams: IQueryParamsObj,
  onChange: (newQueryParamsObj: IQueryParamsObj, delayed: boolean) => Promise<void>
}

const SearchPanel = ({ queryParams, onChange: getPictureList }: ISearchPanelProps) => {
  return (
    <article className={panelStyles["search-panel"]}>
      <SearchInput
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          await getPictureList({ ...queryParams, queryString: e.target.value, page: 1 }, true);
        }
        }></SearchInput>

      <PictureSortSelect
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          getPictureList({ ...queryParams, sort: e.target.value, page: 1 }, false)
        }
        } />
    </article>
  )
};

export default SearchPanel;