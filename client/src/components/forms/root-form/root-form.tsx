import StandartButton from "../../../UI/standart-button/standart-button";
import FormInput from "./form-input/form-input";
import { IRootFormProps } from "./interfaces";

import formStyles from "./root-form.module.css";


const RootForm = ({
  fields,
  buttons,
  disabled,
  formClassName = "",
  fieldsContainerClassName = "",
  fieldsRowClassName = "",
  fieldsColumnClassName = "",
  buttonsContainerClassName = "",
  buttonsRowClassName = "",
  buttonsColumnClassName = "" }: IRootFormProps) => {

  const formStyle = `${formStyles["form"]} ${formClassName}`;
  const fieldsContainerStyles = `${formStyles["fields-container"]} ${fieldsContainerClassName}`;
  const fieldsRowStyles = `${formStyles["fields-row"]} ${fieldsRowClassName}`;
  const fieldsColumnStyles = `${formStyles["fields-column"]} ${fieldsColumnClassName}`;
  const buttonsContainerStyles = `${formStyles["buttons-container"]} ${buttonsContainerClassName}`;
  const buttonsRowStyles = `${formStyles["buttons-row"]} ${buttonsRowClassName}`;
  const buttonsColumnStyles = `${formStyles["buttons-column"]} ${buttonsColumnClassName}`;

  return (
    <form className={formStyle}>
      <section className={fieldsContainerStyles}>
        {
          fields.map(fieldsRow => (
            <div className={fieldsRowStyles}>
              {
                fieldsRow.map(fieldsColumn => (
                  <ul className={fieldsColumnStyles}>
                    {
                      fieldsColumn.map(({ type, header, value, onChange, onValidate }) => (
                        <li>
                          <FormInput type={type} header={header} value={value} disabled={disabled} onChange={onChange} onValidate={onValidate} />
                        </li>
                      ))
                    }
                  </ul>
                ))
              }
            </div>
          ))
        }
      </section>
      <section className={buttonsContainerStyles}>
        {
          buttons.map(buttonsRow => (
            <div className={buttonsRowStyles}>
              {
                buttonsRow.map(buttonsColumn => (
                  <ul className={buttonsColumnStyles}>
                    {
                      buttonsColumn.map(({ type, header, onClick }) => (
                        <li>
                          <StandartButton type={type} onClick={onClick} disabled={disabled}>{header}</StandartButton>
                        </li>
                      ))
                    }
                  </ul>
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