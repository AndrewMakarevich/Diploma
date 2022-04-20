import panelStyles from "./search-panel.module.css";
import SearchInput from "../../../../../UI/search-input/search-input";
import PictureSortSelect from "../../../../inputs/picture-sort-select/picture-sort-select";
import { IQueryParamsObj } from "../picture-list";
import { Context } from "../../../../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

interface ISearchPanelProps {
  onChange: (delayed: boolean) => Promise<void>
}

const SearchPanel = ({ onChange: getPictureList }: ISearchPanelProps) => {
  const { pictureStore } = useContext(Context);
  return (
    <article className={panelStyles["search-panel"]}>
      <SearchInput
        value={pictureStore.queryParams.queryString}
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          runInAction(() => {
            pictureStore.queryParams = { ...pictureStore.queryParams, queryString: e.target.value, page: 1 }
          });
          await getPictureList(true);
        }
        }></SearchInput>

      <PictureSortSelect
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          getPictureList(false)
        }
        } />
    </article>
  )
};

export default observer(SearchPanel);