import { ComponentProps } from "react";
import { MySelectOptGroupField } from "../../../../UI/my-select/my-select";
import SortSelect from "../../../inputs/sort-select/sort-select"

const PictureTagsSortSelect = (props: ComponentProps<"select">) => {
  const selectOptions: MySelectOptGroupField[] = [
    {
      name: "Select by creation date",
      orderByKey: "createdAt"
    },
    {
      name: "Select by last update date",
      orderByKey: "updatedAt"
    },
    {
      name: "Select by amount of pictures",
      orderByKey: "attachedPicturesAmount"
    },
  ]
  return (
    <SortSelect selectOptions={selectOptions} {...props} />
  )
};

export default PictureTagsSortSelect