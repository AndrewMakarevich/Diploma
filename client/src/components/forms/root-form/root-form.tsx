import StandartButton from "../../../UI/standart-button/standart-button";
import FormInput from "./form-input/form-input";
import { IRootFormProps } from "./interfaces";

import formStyles from "./root-form.module.css";


const RootForm = ({ fields, buttons }: IRootFormProps) => {
  return (
    <form className={formStyles["form"]}>
      <section className={formStyles["inputs-container"]}>
        {
          fields.map(fieldsRow => (
            <div className={formStyles["inputs-column"]}>
              {
                fieldsRow.map(({ type, header, value, disabled, onChange, onValidate }) => (
                  <FormInput type={type} header={header} value={value} disabled={disabled} onChange={onChange} onValidate={onValidate} />
                ))
              }
            </div>
          ))
        }
      </section>
      <section className={formStyles["buttons-container"]}>
        {
          buttons.map(buttonsRow => (
            <div className={formStyles["buttons-column"]}>
              {
                buttonsRow.map(({ type, header, onClick }) => (
                  <StandartButton type={type} onClick={onClick}>{header}</StandartButton>
                ))
              }
            </div>
          ))
        }
      </section>
    </form>
  )
};

export default RootForm;