import { ChangeEvent, ComponentProps, HTMLInputTypeAttribute } from "react";
import MySelect, { MySelectOptGroupField, MySelectOptionField } from "../../UI/my-select/my-select";
import SearchInput from "../../UI/search-input/search-input";

export interface ISearchPanelInputField extends ComponentProps<"input"> {
  hightOrderType: "input"
  type: HTMLInputTypeAttribute,
  value: string | number,
  placeholder: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => unknown
}

export interface ISearchPanelSelectField {
  hightOrderType: "select"
  values: MySelectOptGroupField[] | MySelectOptionField[]
}

interface ISearchPanelProps {
  fieldsColumns: (ISearchPanelInputField[] | ISearchPanelSelectField[])[];
}

const SearchPanel = ({ fieldsColumns }: ISearchPanelProps) => {
  return (
    <section>
      {
        fieldsColumns.map(column => (
          <div>
            {
              column.map(field => (
                field.hightOrderType === "input" ?
                  <SearchInput />
                  :
                  <MySelect fields={field.values} />
              ))
            }
          </div>
        ))
      }
    </section>
  )
};

export default SearchPanel;