export interface ITableProps<T> {
  tableHeaders: string[],
  actions: IAction[],
  entities: T[],
  paramsToShow: string[]
}

export interface ITableRowProps {
  entity: { [key: string]: any },
  paramsToShow: string[]
  actions: IAction[]
}

export interface IAction {
  header: string,
  clickHandler: Function
}
