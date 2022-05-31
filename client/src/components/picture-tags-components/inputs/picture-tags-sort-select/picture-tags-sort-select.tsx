import SortSelect from "../../../inputs/sort-select/sort-select"

const PictureTagsSortSelect = () => {
  const selectOptions = [
    {
      name: "Select by creation date",
      options: [
        {
          name: "Ascending",
          value: '["createdAt", "ASC"]'
        },
        {
          name: "Descending",
          value: '["createdAt", "DESC"]'
        }
      ]
    },
    {
      name: "Select by last update date",
      options: [
        {
          name: "Ascending",
          value: '["updatedAt", "ASC"]'
        },
        {
          name: "Descending",
          value: '["updatedAt", "DESC"]'
        }
      ]
    }
  ]
  return (
    <SortSelect selectOptions={selectOptions} />
  )
};

export default PictureTagsSortSelect