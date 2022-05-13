import { ComponentProps } from "react"

export interface ITableProps<T> extends ComponentProps<"table"> {
  tableHeaders: string[],
  actions: IAction[],
  entities: T[],
  paramsToShow: string[]
}

export interface ITableRowProps {
  entity: { [key: string]: any },
  paramsToShow: string[]
  actions: IAction[],
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IAction {
  header: string,
  clickHandler: Function
}
