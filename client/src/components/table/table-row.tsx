import { ITableRowProps } from "./interfaces";

const TableRow = ({ entity, paramsToShow, actions, isLoading, setIsLoading }: ITableRowProps) => {
  return (
    <tr>
      {
        paramsToShow.map(paramKey => (
          <td>{entity[paramKey]}</td>
        ))
      }
      <td>
        {
          actions.map(action => (
            <button
              disabled={isLoading}
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await action.clickHandler(entity);
                } finally {
                  setIsLoading(false);
                }
              }}>{action.header}</button>
          ))
        }
      </td>
    </tr>
  )
};

export default TableRow;