import { IButton, IField } from "../root-form/interfaces";
import RootForm from "../root-form/root-form";

import formStyles from "./standart-one-column-form.module.css";

interface IFormProps {
  fields: IField[],
  additionalButtons?: IButton[],
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => unknown,
  onClearChanges: (e: React.MouseEvent<HTMLButtonElement>) => unknown,
  submitButtonText?: string,
  clearButtonText?: string,
  disabled: boolean,
  formClassName?: string,
  fieldsContainerClassName?: string,
  fieldsRowClassName?: string,
  fieldsColumnClassName?: string,
  buttonsContainerClassName?: string,
  buttonsRowClassName?: string,
  buttonsColumnClassName?: string,
}

const StandartOneColumnForm = ({
  fields,
  additionalButtons = [],
  onSubmit,
  onClearChanges,
  submitButtonText = "Submit",
  clearButtonText = "Clear",
  disabled,
  formClassName = formStyles["form"],
  fieldsContainerClassName,
  fieldsRowClassName,
  fieldsColumnClassName,
  buttonsContainerClassName,
  buttonsRowClassName,
  buttonsColumnClassName }: IFormProps) => {
  const fieldsMap: IField[][][] = [
    [
      fields
    ]
  ];

  const buttonsMap: IButton[][][] = [
    [
      [
        {
          header: submitButtonText,
          type: "submit",
          onClick: onSubmit,
        },
        {
          header: clearButtonText,
          type: "button",
          onClick: onClearChanges
        },
        ...additionalButtons
      ]
    ]
  ]
  return (
    <RootForm
      fields={fieldsMap}
      buttons={buttonsMap}
      disabled={disabled}
      formClassName={formClassName}
      fieldsContainerClassName={fieldsContainerClassName}
      fieldsRowClassName={fieldsRowClassName}
      fieldsColumnClassName={fieldsColumnClassName}
      buttonsContainerClassName={buttonsContainerClassName}
      buttonsRowClassName={buttonsRowClassName}
      buttonsColumnClassName={buttonsColumnClassName} />
  )
};

export default StandartOneColumnForm;