import panelStyles from "./search-panel.module.css";
import SearchInput from "../../../UI/search-input/search-input";
import PictureSortSelect from "../../inputs/picture-sort-select/picture-sort-select";
import { Context } from "../../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import PicturesTypesSelect from "../inputs/pictures-types-select/pictures-types-select";

interface ISearchPanelProps {
  onChange: (target: EventTarget) => Promise<void>
}

const SearchPanel = ({ onChange: getPictureList }: ISearchPanelProps) => {
  const { pictureStore } = useContext(Context);

  const setQueryParam = async (target: EventTarget, paramName: string, paramValue: string) => {
    runInAction(() => {
      pictureStore.queryParams = { ...pictureStore.queryParams, [paramName]: paramValue, page: 1 }
    });

    if (paramValue === "@" || paramValue === "#") {
      return;
    }
    await getPictureList(target);
  }

  return (
    <article className={panelStyles["search-panel"]}>
      <SearchInput
        value={pictureStore.queryParams.queryString}
        onChange={(e) => setQueryParam(e.target, "queryString", e.target.value)}></SearchInput>

      <PicturesTypesSelect className={panelStyles["picture-types-select"]} value={pictureStore.queryParams.pictureTypeId} onChange={(e) => setQueryParam(e.target, "pictureTypeId", e.target.value)} />

      <PictureSortSelect value={pictureStore.queryParams.sort} onChange={(e) => setQueryParam(e.target, "sort", e.target.value)} />
    </article>
  )
};

export default observer(SearchPanel);