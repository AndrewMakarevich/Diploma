import StandartButton from "../../UI/standart-button/standart-button";
import { ITableRowProps } from "./interfaces";

import tableStyles from "./table.module.css";

const TableRow = ({ entity, paramsToShow, actions, isLoading, setIsLoading }: ITableRowProps) => {
  return (
    <tr>
      {
        paramsToShow.map(paramKey => (
          <td>{entity[paramKey]}</td>
        ))
      }
      {
        Boolean(actions?.length) &&
        <td className={tableStyles["actions-table-cell"]}>
          {
            actions?.map(action => (
              <StandartButton
                disabled={isLoading}
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await action.clickHandler(entity);
                  } finally {
                    setIsLoading(false);
                  }
                }}>{action.header}</StandartButton>
            ))
          }
        </td>
      }
    </tr>
  )
};

export default TableRow;