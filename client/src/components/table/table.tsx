import { useState } from "react";
import { ITableProps } from "./interfaces";
import TableRow from "./table-row";

const Table = <T,>({ tableHeaders, entities, paramsToShow, actions }: ITableProps<T>) => {
  const [actionLoading, setActionLoading] = useState(false);
  return (
    <table>
      <thead>
        {tableHeaders.map(header => (
          <th>{header}</th>
        ))}
        {Boolean(actions.length) && <th>Actions</th>}
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