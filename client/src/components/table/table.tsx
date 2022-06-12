import { useState } from "react";
import { ITableProps } from "./interfaces";
import TableRow from "./table-row";

import tableStyles from "./table.module.css";

const Table = <T extends { id: number },>({ tableHeaders, entities, paramsToShow, actions, className }: ITableProps<T>) => {
  const [actionLoading, setActionLoading] = useState(false);
  return (
    <table className={`${tableStyles["table"]} ${className ? className : ""}`}>
      <thead className={tableStyles["table-head"]}>
        <tr>
          {tableHeaders.map(header => (
            <th key={header}>{header}</th>
          ))}
          {Boolean(actions?.length) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {
          entities.map(entity => (
            <TableRow key={entity.id} entity={entity} paramsToShow={paramsToShow} actions={actions} isLoading={actionLoading} setIsLoading={setActionLoading} />
          ))
        }
      </tbody>
    </table>
  )
}

export default Table;