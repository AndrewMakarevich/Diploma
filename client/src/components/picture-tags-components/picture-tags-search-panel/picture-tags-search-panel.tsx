import SearchInput from "../../../UI/search-input/search-input"
import PictureTagsSortSelect from "../inputs/picture-tags-sort-select/picture-tags-sort-select"

import panelStyles from "./picture-tags-search-panel.module.css";

const PictureTagsSearchPanel = () => {
  return (
    <div className={panelStyles["container"]}>
      <SearchInput />
      <PictureTagsSortSelect />
    </div>
  )
}

export default PictureTagsSearchPanel;