import { ITableProps } from "./interfaces";
import TableRow from "./table-row";

const Table = <T,>({ tableHeaders, entities, paramsToShow, actions }: ITableProps<T>) => {
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
            <TableRow entity={entity} paramsToShow={paramsToShow} actions={actions} />
          ))
        }
      </tbody>
    </table>
  )
}

export default Table;