import StandartButton from "../../UI/standart-button/standart-button";
import { IAction, ITableRowProps } from "./interfaces";

import tableStyles from "./table.module.css";

const TableRow = ({ entity, paramsToShow, actions, isLoading, setIsLoading }: ITableRowProps) => {
  const onActionHandler = (action: IAction) => async () => {
    try {
      setIsLoading(true);
      await action.clickHandler(entity);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <tr>
      {
        paramsToShow.map((paramKey, index) => (
          <td key={index}>{entity[paramKey]}</td>
        ))
      }
      {
        Boolean(actions?.length) &&
        <td className={tableStyles["actions-table-cell"]}>
          {
            actions?.map(action => (
              <StandartButton
                key={action.header}
                disabled={isLoading}
                onClick={onActionHandler(action)}>{action.header}</StandartButton>
            ))
          }
        </td>
      }
    </tr>
  )
};

export default TableRow;