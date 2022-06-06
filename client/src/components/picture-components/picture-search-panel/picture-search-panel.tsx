import panelStyles from "./search-panel.module.css";
import SearchInput from "../../../UI/search-input/search-input";
import PictureSortSelect from "../inputs/picture-sort-select/picture-sort-select";
import { Context } from "../../..";
import { ChangeEvent, useContext } from "react";
import { observer } from "mobx-react-lite";
import PicturesTypesSelect from "../inputs/pictures-types-select/pictures-types-select";

interface ISearchPanelProps {
  onQueryStringChange: (event: ChangeEvent<HTMLInputElement>) => void,
  onPictureTypeChange: (event: ChangeEvent<HTMLSelectElement>) => void,
  onOrderParamChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

const PictureSearchPanel = ({ onQueryStringChange, onPictureTypeChange, onOrderParamChange }: ISearchPanelProps) => {
  const { pictureStore } = useContext(Context);

  return (
    <article className={panelStyles["search-panel"]}>
      <SearchInput
        value={pictureStore.queryParams.queryString}
        onChange={onQueryStringChange}></SearchInput>

      <PicturesTypesSelect
        className={panelStyles["picture-types-select"]}
        value={pictureStore.queryParams.pictureTypeId}
        onChange={onPictureTypeChange} />

      <PictureSortSelect
        value={`["${pictureStore.queryParams.cursor.key}","${pictureStore.queryParams.cursor.order}"]`}
        onChange={onOrderParamChange} />
    </article>
  )
};

export default observer(PictureSearchPanel);