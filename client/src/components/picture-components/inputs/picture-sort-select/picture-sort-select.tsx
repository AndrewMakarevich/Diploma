import { ComponentProps } from "react";
import { MySelectOptGroupField } from "../../../../UI/my-select/my-select";
import SortSelect from "../../../inputs/sort-select/sort-select";

const selectOptions: MySelectOptGroupField[] = [
  {
    name: "Sort by creation date",
    orderByKey: "createdAt"
  },
  {
    name: "Sort by last update date",
    orderByKey: "updatedAt"
  },
  {
    name: "Sort by likes",
    orderByKey: "likesAmount"
  },
  {
    name: "Sort by comments amount",
    orderByKey: "commentsAmount"
  },
]

const PictureSortSelect = (props: ComponentProps<"select">) => {
  return (
    <SortSelect selectOptions={selectOptions} {...props} />
  )
};

export default PictureSortSelect;