import { ChangeEvent, FormEvent, MouseEventHandler, useState } from "react";
import formStyles from "./create-form.module.css";

interface ICreateFormProps<T> {
  paramsToCreate: { paramName: string, header: string }[],
  isLoading: boolean,
  onSubmit: (e: FormEvent<HTMLButtonElement>, essenceObj: T) => void
}

const CreateForm = <T extends {},>({ paramsToCreate, onSubmit, isLoading }: ICreateFormProps<T>) => {
  const [params, setParams] = useState({});

  const setNewParam = (paramName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!isLoading) {
      setParams({ ...params, [paramName]: e.target.value })
    }
  };

  const clearInput = (paramName: string) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setParams({ ...params, [paramName]: "" })
  };

  const submitForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!isLoading) {
      onSubmit(e, params as T);
    }
  };

  return <form>
    {
      paramsToCreate.map(param => (
        <label>
          <p>{param.header}</p>
          <input disabled={isLoading} placeholder={param.header} onChange={setNewParam(param.paramName)}></input>
          <button disabled={isLoading} type="button" onClick={clearInput(param.paramName)}>clear</button>
        </label>
      ))
    }
    <button disabled={isLoading} onClick={submitForm}>Submit</button>
  </form>
};

export default CreateForm;