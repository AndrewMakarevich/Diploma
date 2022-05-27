import { ComponentProps } from "react";
import MySelect from "../../../../UI/my-select/my-select";

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

export default PictureTypeSortSelect;