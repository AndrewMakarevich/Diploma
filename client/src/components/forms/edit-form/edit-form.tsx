import { useEffect, useState } from "react";

interface IEditFormProps<T> {
  initialParams: T,
  paramsAbleToEdit: string[],
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
    <form>
      {
        paramsAbleToEdit.map(paramKey => (
          <input
            value={editedParams[paramKey]}
            onChange={(e) => setEditedParams({ ...editedParams, [paramKey]: e.target.value })}></input>
        ))
      }

      <button disabled={isLoading} type="button" onClick={() => setEditedParams(initialParams)}>Clear changes</button>
      <button
        type="submit"
        disabled={isLoading}
        onClick={async (e) => {
          e.preventDefault();
          await onSubmit(editedParams);
        }}>Submit changes</button>
    </form>
  )
};

export default EditForm;