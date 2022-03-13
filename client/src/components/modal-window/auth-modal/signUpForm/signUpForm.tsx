import authModalStyles from '../auth-modal.module.css';
import LoginBtn from '../../../btns/login-btn/login-btn';
import { IuserAuthData } from '../../../../interfaces/authentificateInterfaces';

const SignUpForm = (
  { authData, setAuthData }:
    { authData: IuserAuthData, setAuthData: React.Dispatch<React.SetStateAction<IuserAuthData>> }
) => {
  return (
    <form className={authModalStyles["auth-form"]}>
      <ul className={authModalStyles["auth-input__list"]}>
        <li className={authModalStyles["auth-input__item"]}>
          <label className={authModalStyles["auth-input__label"]}>
            <input
              placeholder=' '
              className={authModalStyles["auth-input"]}
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}></input>
            <span className={authModalStyles["auth-label__span"]}>Email</span>
          </label>
        </li>
        <li className={authModalStyles["auth-input__item"]}>
          <label className={authModalStyles["auth-input__label"]}>
            <input
              placeholder=' '
              className={authModalStyles["auth-input"]}
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}></input>
            <span className={authModalStyles["auth-label__span"]}>Password</span>
          </label>
        </li>
      </ul>
      <LoginBtn stylesById={authModalStyles["login-btn"]} email={authData.email} password={authData.password} />
    </form>
  )
};
export default SignUpForm;