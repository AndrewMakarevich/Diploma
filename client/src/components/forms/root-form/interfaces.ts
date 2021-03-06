import { HTMLInputTypeAttribute } from "react"

export interface IField {
  type: HTMLInputTypeAttribute,
  header: string,
  value?: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown,
  onValidate: (paramValue: string, alert: boolean) => boolean,
}

export interface IButton {
  type?: "button" | "submit" | "reset" | undefined,
  header: string,
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
}

export interface IRootFormProps {
  fields: IField[][][],
  buttons: IButton[][][],
  disabled: boolean,
  formClassName?: string,
  fieldsContainerClassName?: string,
  fieldsRowClassName?: string,
  fieldsColumnClassName?: string,
  buttonsContainerClassName?: string,
  buttonsRowClassName?: string,
  buttonsColumnClassName?: string,
}