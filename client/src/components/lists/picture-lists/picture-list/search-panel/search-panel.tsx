import panelStyles from "./search-panel.module.css";
import SearchInput from "../../../../../UI/search-input/search-input";
import PictureSortSelect from "../../../../inputs/picture-sort-select/picture-sort-select";
import { IQueryParamsObj } from "../picture-list";

interface ISearchPanelProps {
  queryParams: IQueryParamsObj,
  onChange: React.Dispatch<React.SetStateAction<IQueryParamsObj>>
}

const SearchPanel = ({ queryParams, onChange: setQueryParams }: ISearchPanelProps) => {
  return (
    <article className={panelStyles["search-panel"]}>
      <SearchInput
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQueryParams({ ...queryParams, queryString: e.target.value });
        }
        }></SearchInput>

      <PictureSortSelect
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQueryParams({ ...queryParams, sort: e.target.value })
        }
        } />
    </article>
  )
};

export default SearchPanel;