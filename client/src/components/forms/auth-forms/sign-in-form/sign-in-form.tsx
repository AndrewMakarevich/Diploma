import React from 'react';
import formStyles from '../common-form-styles.module.css';
import { IuserAuthData } from '../../../../interfaces/authentificateInterfaces';
import RegistrationBtn from '../../../btns/registration-btn/registration-btn';

const SignInForm = (
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
              value={authData.nickname}
              onChange={(e) => setAuthData({ ...authData, nickname: e.target.value })}></input>
            <span className={formStyles["auth-label__span"]}>Nickname</span>
          </label>
        </li>
        <li className={formStyles["auth-input__item"]}>
          <label className={formStyles["auth-input__label"]}>
            <input
              placeholder=' '
              type="password"
              className={formStyles["auth-input"]}
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}></input>
            <span className={formStyles["auth-label__span"]}>Password</span>
          </label>
        </li>
        <li className={formStyles["auth-input__item"]}>
          <label className={formStyles["auth-input__label"]}>
            <input
              placeholder=' '
              type="password"
              className={formStyles["auth-input"]}
              onChange={(e) => setAuthData({ ...authData, repPassword: e.target.value })}></input>
            <span className={formStyles["auth-label__span"]}>Repeat password</span>
          </label>
        </li>
      </ul>
      <RegistrationBtn
        email={authData.email}
        nickname={authData.nickname}
        password={authData.password}
        repPassword={authData.repPassword} />
    </form>
  )
};
export default SignInForm;