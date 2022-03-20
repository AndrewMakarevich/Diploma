import { useEffect, useState } from "react";
interface IGroupSelectProps<stateType> {
  wrapperClassName?: string,
  firstOptStyles?: string,
  secOptStyles?: string,
  valuesObj: { [key: string]: string[] },
  state: stateType,
  setState: React.Dispatch<React.SetStateAction<stateType>>,
  firstOptName: string,
  secOptName: string,
}

function PairSelects<stateType>({ wrapperClassName, firstOptStyles, secOptStyles, valuesObj, state, setState, firstOptName, secOptName }: IGroupSelectProps<stateType>) {
  const [chosenOptGroup, setChosenOptGroup] = useState<string[]>([]);

  useEffect(() => {
    const userDefValue = (state as any)[firstOptName]

    if (userDefValue) {
      setChosenOptGroup(valuesObj[userDefValue]);
    }
  }, []);

  return (
    <div className={wrapperClassName}>
      <select className={firstOptStyles} value={(state as any)[firstOptName]} onChange={(e) => {
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
      <select className={secOptStyles} value={(state as any)[secOptName]} onChange={(e) => setState({ ...state, [secOptName]: e.target.value })}>
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
export default PairSelects;