import formStyles from '../common-form-styles.module.css';
import LoginBtn from '../../../btns/login-btn/login-btn';
import { IuserAuthData } from '../../../../interfaces/authentificateInterfaces';

const SignUpForm = (
  { authData, setAuthData }:
    { authData: IuserAuthData, setAuthData: React.Dispatch<React.SetStateAction<IuserAuthData>> }
) => {
  return (
    <form className={formStyles["auth-form"]}>
      <ul className={formStyles["auth-input__list"]}>
        <li className={formStyles["auth-input__item"]}>
          <label className={formStyles["auth-input__label"]}>
            <input
              placeholder=' '
              className={formStyles["auth-input"]}
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}></input>
            <span className={formStyles["auth-label__span"]}>Email</span>
          </label>
        </li>
        <li className={formStyles["auth-input__item"]}>
          <label className={formStyles["auth-input__label"]}>
            <input
              placeholder=' '
              className={formStyles["auth-input"]}
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}></input>
            <span className={formStyles["auth-label__span"]}>Password</span>
          </label>
        </li>
      </ul>
      <LoginBtn email={authData.email} password={authData.password} />
    </form>
  )
};
export default SignUpForm;