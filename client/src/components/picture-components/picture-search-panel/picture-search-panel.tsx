import panelStyles from "./search-panel.module.css";
import SearchInput from "../../../UI/search-input/search-input";
import PictureSortSelect from "../inputs/picture-sort-select/picture-sort-select";
import { Context } from "../../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import PicturesTypesSelect from "../inputs/pictures-types-select/pictures-types-select";
import { IGetPicturesCursorInterface } from "../../../interfaces/services/pictureSericeInterfaces";

interface ISearchPanelProps {
  onChange: (target?: EventTarget) => void
}

const PictureSearchPanel = ({ onChange: getPictureList }: ISearchPanelProps) => {
  const { pictureStore } = useContext(Context);

  const setQueryParam = async (target: EventTarget, paramName: string, paramValue: string | string[] | number | number[] | object) => {
    if (pictureStore.picturesLoading) {
      return;
    }

    runInAction(() => {
      pictureStore.queryParams[paramName] = paramValue;
      pictureStore.locallyAddedPicturesIds = [];
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
        disabled={pictureStore.picturesLoading}
        onChange={(e) => setQueryParam(e.target, "queryString", e.target.value)}></SearchInput>

      <PicturesTypesSelect
        className={panelStyles["picture-types-select"]}
        value={pictureStore.queryParams.pictureTypeId}
        disabled={pictureStore.picturesLoading}
        onChange={(e) => setQueryParam(e.target, "pictureTypeId", e.target.value)} />

      <PictureSortSelect
        value={`["${pictureStore.queryParams.cursor.key}","${pictureStore.queryParams.cursor.order}"]`}
        disabled={pictureStore.picturesLoading}
        onChange={(e) => {
          const { cursor } = pictureStore.queryParams;
          const arr = JSON.parse(e.target.value);
          setQueryParam(e.target, "cursor", { ...cursor, key: arr[0], order: arr[1] });
        }} />
    </article>
  )
};

export default observer(PictureSearchPanel);