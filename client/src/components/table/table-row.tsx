import { ITableRowProps } from "./interfaces";

const TableRow = ({ entity, paramsToShow, actions }: ITableRowProps) => {
  return (
    <tr>
      {
        paramsToShow.map(paramKey => (
          <td>{entity[paramKey]}</td>
        ))
      }
    </tr>
  )
};

export default TableRow;