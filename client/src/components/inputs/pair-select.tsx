import { useEffect, useState } from "react";
interface IGroupSelectProps<stateType> {
  valuesObj: { [key: string]: string[] },
  state: stateType,
  setState: React.Dispatch<React.SetStateAction<stateType>>,
  firstOptName: string,
  secOptName: string,
}

function MySelect<stateType>({ valuesObj, state, setState, firstOptName, secOptName }: IGroupSelectProps<stateType>) {
  const [chosenOptGroup, setChosenOptGroup] = useState<string[]>([]);

  useEffect(() => {
    const userDefValue = (state as any)[firstOptName]

    if (userDefValue) {
      setChosenOptGroup(valuesObj[userDefValue]);
    }
  }, []);

  return (
    <div className="pair-select__wrapper">
      <select value={(state as any)[firstOptName]} onChange={(e) => {
        setChosenOptGroup(valuesObj[e.target.value]);
        setState({ ...state, [firstOptName]: e.target.value })
      }
      }>
        {
          Object.keys(valuesObj).map((optGroupValue, index) => {
            return <option key={index} value={optGroupValue}>{optGroupValue}</option>
          })
        }
      </select>
      <select value={(state as any)[secOptName]} onChange={(e) => setState({ ...state, [secOptName]: e.target.value })}>
        {
          chosenOptGroup.map((optValue, index) => {
            return <option
              key={index}
              value={optValue}
            >{optValue}</option>
          })
        }
      </select>
    </div>

  )
};
export default MySelect;