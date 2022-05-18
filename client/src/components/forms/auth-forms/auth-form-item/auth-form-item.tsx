import { IUserAuthData } from "../../../../interfaces/authentificateInterfaces";

import formStyles from "../common-form-styles.module.css";


interface IAuthFormItemProps {
  authData: IUserAuthData,
  setAuthData: React.Dispatch<React.SetStateAction<IUserAuthData>>
  paramName: string,
  header: string
}

const AuthFormItem = ({ authData, setAuthData, paramName, header }: IAuthFormItemProps) => {
  return (
    <li className={formStyles["auth-input__item"]}>
      <label className={formStyles["auth-input__label"]}>
        <input
          placeholder=' '
          className={formStyles["auth-input"]}
          value={authData[paramName]}
          onChange={(e) => setAuthData({ ...authData, [paramName]: e.target.value })}></input>
        <span className={formStyles["auth-label__span"]}>{header}</span>
      </label>
    </li>
  )
};

export default AuthFormItem;