import { ChangeEvent } from "react";
import SearchInput from "../../../UI/search-input/search-input"
import PictureTagsSortSelect from "../inputs/picture-tags-sort-select/picture-tags-sort-select"

import panelStyles from "./picture-tags-search-panel.module.css";

interface IPictureTagsSearchPanelProps {
  onQueryStringChange: (e: ChangeEvent<HTMLInputElement>) => void,
  onOrderParamChange: (e: ChangeEvent<HTMLSelectElement>) => void,
  isLoading: boolean
}

const PictureTagsSearchPanel = ({ onQueryStringChange, onOrderParamChange, isLoading }: IPictureTagsSearchPanelProps) => {
  return (
    <div className={panelStyles["container"]}>
      <SearchInput disabled={isLoading} onChange={onQueryStringChange} />
      <PictureTagsSortSelect disabled={isLoading} onChange={onOrderParamChange} />
    </div>
  )
}

export default PictureTagsSearchPanel;