import { useState } from "react";
import { ITableProps } from "./interfaces";
import TableRow from "./table-row";

import tableStyles from "./table.module.css";

const Table = <T,>({ tableHeaders, entities, paramsToShow, actions, className }: ITableProps<T>) => {
  const [actionLoading, setActionLoading] = useState(false);
  return (
    <table className={`${tableStyles["table"]} ${className ? className : ""}`}>
      <thead>
        <tr>
          {tableHeaders.map(header => (
            <th>{header}</th>
          ))}
          {Boolean(actions.length) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {
          entities.map(entity => (
            <TableRow entity={entity} paramsToShow={paramsToShow} actions={actions} isLoading={actionLoading} setIsLoading={setActionLoading} />
          ))
        }
      </tbody>
    </table>
  )
}

export default Table;