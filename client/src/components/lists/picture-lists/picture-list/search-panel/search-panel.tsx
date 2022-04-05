import { IQueryParamsObj } from "../picture-list";

interface ISearchPanelProps {
  queryParams: IQueryParamsObj,
  onChange: React.Dispatch<React.SetStateAction<IQueryParamsObj>>
}

const SearchPanel = ({ queryParams, onChange: setQueryParams }: ISearchPanelProps) => {
  return (
    <article>
      <input onChange={(e) => { setQueryParams({ ...queryParams, queryString: e.target.value }) }}></input>
    </article>
  )
};

export default SearchPanel;