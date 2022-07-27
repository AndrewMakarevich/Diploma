import { ComponentProps } from "react";
import { MySelectOptGroupField } from "../../../../UI/my-select/my-select";
import SortSelect from "../../../inputs/sort-select/sort-select";

const PictureTypeSortSelect = (props: ComponentProps<"select">) => {
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
      name: "Sort by pictures amount",
      orderByKey: "picturesAmount"
    }
  ]

  return (
    <SortSelect selectOptions={selectOptions} {...props} />
  )
};

export default PictureTypeSortSelect;