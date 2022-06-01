import { ComponentProps } from "react";
import SortSelect from "../../../inputs/sort-select/sort-select"

const PictureTagsSortSelect = (props: ComponentProps<"select">) => {
  const selectOptions = [
    {
      name: "Select by creation date",
      options: [
        {
          name: "Ascending",
          value: ["createdAt", "ASC"]
        },
        {
          name: "Descending",
          value: ["createdAt", "DESC"]
        }
      ]
    },
    {
      name: "Select by last update date",
      options: [
        {
          name: "Ascending",
          value: ["updatedAt", "ASC"]
        },
        {
          name: "Descending",
          value: ["updatedAt", "DESC"]
        }
      ]
    },
    {
      name: "Select by amount of pictures",
      options: [
        {
          name: "Ascending",
          value: ["attachedPicturesAmount", "ASC"]
        },
        {
          name: "Descending",
          value: ["attachedPicturesAmount", "DESC"]
        }
      ]
    },
  ]
  return (
    <SortSelect selectOptions={selectOptions} {...props} />
  )
};

export default PictureTagsSortSelect