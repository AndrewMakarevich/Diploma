import panelStyles from "./search-panel.module.css";
import SearchInput from "../../../UI/search-input/search-input";
import PictureSortSelect from "../../inputs/picture-sort-select/picture-sort-select";
import { Context } from "../../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import PicturesTypesSelect from "../inputs/pictures-types-select/pictures-types-select";

interface ISearchPanelProps {
  onChange: (delayed: boolean) => Promise<void>
}

const SearchPanel = ({ onChange: getPictureList }: ISearchPanelProps) => {
  const { pictureStore } = useContext(Context);

  const setQueryParam = async (paramName: string, paramValue: string, delayed: boolean) => {
    runInAction(() => {
      pictureStore.queryParams = { ...pictureStore.queryParams, [paramName]: paramValue, page: 1 }
    });

    if (paramValue === "@" || paramValue === "#") {
      return;
    }
    await getPictureList(delayed);
  }

  return (
    <article className={panelStyles["search-panel"]}>
      <SearchInput
        value={pictureStore.queryParams.queryString}
        onChange={(e) => setQueryParam("queryString", e.target.value, true)}></SearchInput>

      <PicturesTypesSelect className={panelStyles["picture-types-select"]} value={pictureStore.queryParams.pictureTypeId} onChange={(e) => setQueryParam("pictureTypeId", e.target.value, false)} />

      <PictureSortSelect value={pictureStore.queryParams.sort} onChange={(e) => setQueryParam("sort", e.target.value, false)} />
    </article>
  )
};

export default observer(SearchPanel);