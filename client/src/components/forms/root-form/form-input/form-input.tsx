import { ChangeEvent, FocusEvent, HTMLInputTypeAttribute, useState } from "react";

import inputStyles from "./form-input.module.css";

interface IFormInputProps {
  disabled?: boolean
  value?: string,
  header: string,
  type: HTMLInputTypeAttribute,
  onChange: (e: ChangeEvent<HTMLInputElement>) => unknown
  onValidate: (paramValue: string, alert: boolean) => boolean
}

const FormInput = ({ disabled, value, type, header, onChange, onValidate }: IFormInputProps) => {
  const [valueIsInvalid, setValueIsInvalid] = useState(false);
  const [invalidValidationMsg, setInvalidValidationMsg] = useState("");

  const onValidateHandler = (e: FocusEvent<HTMLInputElement, Element>) => {
    try {
      onValidate(e.target.value, true);

      if (valueIsInvalid) {
        setValueIsInvalid(false);
        setInvalidValidationMsg("");
      }
    } catch (e) {
      setValueIsInvalid(true);
      setInvalidValidationMsg(String(e));
    }
  }
  return (
    <label className={inputStyles["label"]}>
      <input
        disabled={disabled}
        value={value}
        className={`${inputStyles["input"]} ${valueIsInvalid ? inputStyles["invalid"] : ""}`}
        type={type}
        placeholder=" "
        onChange={onChange}
        onBlur={onValidateHandler}></input>
      <span className={inputStyles["span"]}>{header}</span>
      {
        Boolean(invalidValidationMsg) && <p className={inputStyles["error-text"]}>{invalidValidationMsg}</p>
      }
    </label>
  )
};

export default FormInput;