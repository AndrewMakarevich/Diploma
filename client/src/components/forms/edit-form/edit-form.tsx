import { useEffect, useState } from "react";
import StandartButton from "../../../UI/standart-button/standart-button";
import StandartInput from "../../../UI/standart-input/standart-input";

import formStyles from "./edit-form.module.css";

interface IEditFormProps<T> {
  initialParams?: T,
  paramsAbleToEdit: { placeholder: string, paramName: string }[],
  onSubmit: (editedParams: T) => Promise<void>,
  isLoading: boolean
}

const EditForm = <T extends { [key: string]: any },>({ initialParams, paramsAbleToEdit, onSubmit, isLoading }: IEditFormProps<T>) => {
  const [editedParams, setEditedParams] = useState<IEditFormProps<any>["initialParams"]>({});

  useEffect(() => {
    if (initialParams) {
      setEditedParams(initialParams);
    }
  }, [initialParams])
  return (
    <form className={formStyles["form"]}>
      {
        paramsAbleToEdit.map(({ paramName, placeholder }) => (
          <StandartInput
            placeholder={placeholder}
            value={editedParams[paramName]}
            onChange={(e) => setEditedParams({ ...editedParams, [paramName]: e.target.value })}></StandartInput>
        ))
      }

      <StandartButton disabled={isLoading} type="button" onClick={() => setEditedParams(initialParams)}>Clear changes</StandartButton>
      <StandartButton
        type="submit"
        disabled={isLoading}
        onClick={async (e) => {
          e.preventDefault();
          await onSubmit(editedParams);
        }}>Submit changes</StandartButton>
    </form>
  )
};

export default EditForm;