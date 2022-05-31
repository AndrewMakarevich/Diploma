import { ComponentProps } from "react";
import SortSelect from "../../../inputs/sort-select/sort-select";

const PictureTypeSortSelect = (props: ComponentProps<"select">) => {
  const selectOptions = [
    {
      name: "Sort by creation date",
      options: [
        {
          value: ["createdAt", "DESC"],
          name: "Descending"
        },
        {
          value: ["createdAt", "ASC"],
          name: "Ascending"
        },
      ]
    },
    {
      name: "Sort by last update date",
      options: [
        {
          value: ["updatedAt", "DESC"],
          name: "Descending"
        },
        {
          value: ["updatedAt", "ASC"],
          name: "Ascending"
        },
      ]
    },
    {
      name: "Sort by pictures amount",
      options: [
        {
          value: ["picturesAmount", "DESC"],
          name: "Descending"
        },
        {
          value: ["picturesAmount", "ASC"],
          name: "Ascending"
        },
      ]
    }
  ]

  return (
    <SortSelect selectOptions={selectOptions} {...props} />
  )
};

export default PictureTypeSortSelect;