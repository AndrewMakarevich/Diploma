import { ChangeEvent } from "react";
import SearchInput from "../../../UI/search-input/search-input"
import PictureTagsSortSelect from "../inputs/picture-tags-sort-select/picture-tags-sort-select"

import panelStyles from "./picture-tags-search-panel.module.css";

interface IPictureTagsSearchPanelProps {
  onQueryStringChange: (e: ChangeEvent<HTMLInputElement>) => void,
  onOrderParamChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

const PictureTagsSearchPanel = ({ onQueryStringChange, onOrderParamChange }: IPictureTagsSearchPanelProps) => {
  return (
    <div className={panelStyles["container"]}>
      <SearchInput onChange={onQueryStringChange} />
      <PictureTagsSortSelect onChange={onOrderParamChange} />
    </div>
  )
}

export default PictureTagsSearchPanel;