import SearchInput from "../../../UI/search-input/search-input";
import PictureTypeSortSelect from "../inputs/picture-type-sort-select/picture-type-sort-select";

import panelStyles from "./picture-types-search-panel.module.css"

interface IPictureTypesSearchPanelProps {
  setQueryString: (e: React.ChangeEvent<HTMLInputElement>) => void,
  setSortParam: (e: React.ChangeEvent<HTMLSelectElement>) => void,
}

const PictureTypesSearchPanel = ({ setQueryString, setSortParam }: IPictureTypesSearchPanelProps) => {
  return (
    <div className={panelStyles["search-panel"]}>
      <SearchInput onChange={setQueryString} />
      <PictureTypeSortSelect onChange={setSortParam} />
    </div>
  )
};

export default PictureTypesSearchPanel;