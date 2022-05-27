import { HTMLInputTypeAttribute } from "react";
import StandartButton from "../../../UI/standart-button/standart-button";
import RootFormInput from "./form-input/form-input";

interface IField {
  placeholder: string,
  propName: string,
  type: HTMLInputTypeAttribute
}
interface IRootFormProps {
  fields: IField[],
  onSubmit: (...args: unknown[]) => {}
}

const RootForm = ({ fields, onSubmit }: IRootFormProps) => {
  const submitHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form>
      {/* {
        fields.map(({ type, propName, placeholder }) => (
          <RootFormInput type={type} propName={propName} placeholder={placeholder} />
        ))
      }
      <StandartButton type="submit" onClick={submitHandler}></StandartButton> */}
    </form>
  )
};

export default RootForm;