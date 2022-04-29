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

  const setQueryParam = async (paramName: string, event: React.ChangeEvent<any>, delayed: boolean) => {
    runInAction(() => {
      pictureStore.queryParams = { ...pictureStore.queryParams, [paramName]: event.target.value, page: 1 }
    });
    await getPictureList(delayed);
  }

  return (
    <article className={panelStyles["search-panel"]}>
      <SearchInput
        value={pictureStore.queryParams.queryString}
        onChange={(e) => setQueryParam("queryString", e, true)}></SearchInput>

      <PicturesTypesSelect onChange={(e) => setQueryParam("pictureTypeId", e, false)} />

      <PictureSortSelect onChange={(e) => setQueryParam("sort", e, false)} />
    </article>
  )
};

export default observer(SearchPanel);