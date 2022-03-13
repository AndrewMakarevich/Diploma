import React from 'react';
import authModalStyles from '../auth-modal.module.css';
import { IuserAuthData } from '../../../../interfaces/authentificateInterfaces';
import RegistrationBtn from '../../../btns/registration-btn/registration-btn';

const SignInForm = (
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
              value={authData.nickname}
              onChange={(e) => setAuthData({ ...authData, nickname: e.target.value })}></input>
            <span className={authModalStyles["auth-label__span"]}>Nickname</span>
          </label>
        </li>
        <li className={authModalStyles["auth-input__item"]}>
          <label className={authModalStyles["auth-input__label"]}>
            <input
              placeholder=' '
              type="password"
              className={authModalStyles["auth-input"]}
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}></input>
            <span className={authModalStyles["auth-label__span"]}>Password</span>
          </label>
        </li>
        <li className={authModalStyles["auth-input__item"]}>
          <label className={authModalStyles["auth-input__label"]}>
            <input
              placeholder=' '
              type="password"
              className={authModalStyles["auth-input"]}
              onChange={(e) => setAuthData({ ...authData, repPassword: e.target.value })}></input>
            <span className={authModalStyles["auth-label__span"]}>Repeat password</span>
          </label>
        </li>
      </ul>
      <RegistrationBtn stylesById={authModalStyles["registration-btn"]}
        email={authData.email}
        nickname={authData.nickname}
        password={authData.password}
        repPassword={authData.repPassword} />
    </form>
  )
};
export default SignInForm;