import { ComponentProps } from "react";
import MySelect from "../../../UI/my-select/my-select";

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
    name: "Sort by likes update date",
    options: [
      {
        value: ["likesAmount", "DESC"],
        name: "Descending"
      },
      {
        value: ["likesAmount", "ASC"],
        name: "Ascending"
      },
    ]
  },
]

const PictureSortSelect = (props: ComponentProps<any>) => {
  return (
    <MySelect {...props}>
      {
        selectOptions.map(optGroup =>
          <optgroup key={optGroup.name} label={optGroup.name}>
            {
              optGroup.options.map(option =>
                <option key={option.name} label={option.name} value={JSON.stringify(option.value)}></option>
              )
            }
          </optgroup>
        )
      }
    </MySelect>
  )
};

export default PictureSortSelect;