import authModalStyles from './auth-modal.module.css'
import { useContext, useEffect, useState } from "react";
import { observer } from 'mobx-react-lite'
import { Context } from "../../..";
import useQueryParam from "../../../hooks/useQueryParam";
import QueryModalWindow from "../query-modal-window"
import { getParams, getParamsEnums } from "../../../consts/popup-routes";
import { useSearchParams } from "react-router-dom";
import LoginBtn from '../../btns/login-btn/login-btn';
import RegistrationBtn from '../../btns/registration-btn/registration-btn';

const AuthModal = () => {
  const { modalStore } = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();
  const [authData, setAuthData] = useState({
    email: '',
    nickname: '',
    password: ''
  });
  function changeSearchParam(paramName: string, paramValue: string, searchParams: URLSearchParams, setSearchParams: Function) {
    searchParams.set(paramName, paramValue);
    setSearchParams(searchParams);
  }
  const popup = useQueryParam(getParams.popup);
  const type = useQueryParam(getParams.type);
  if (popup === getParamsEnums.popup.auth) {
    modalStore.modalSearchParams.push(getParams.popup);
    modalStore.modalSearchParams.push(getParams.type);
    return (
      <QueryModalWindow stylesById={authModalStyles['auth-modal']}>
        {
          type === 'sign-in' ?
            <>
              <h3 className={authModalStyles["auth__header"]}>{process.env.REACT_APP_SITE_NAME} | Registration</h3>
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
                      className={authModalStyles["auth-input"]}></input>
                    <span className={authModalStyles["auth-label__span"]}>Repeat password</span>
                  </label>
                </li>
              </ul>
              <RegistrationBtn stylesById={authModalStyles["registration-btn"]} email={authData.email} nickname={authData.nickname} password={authData.password} />
              <h4 className={authModalStyles["auth__change-form-header"]}>
                Already have an account?
                <button className={authModalStyles["auth__change-form-btn"]} onClick={() => changeSearchParam(getParams.type, getParamsEnums.type.signup, searchParams, setSearchParams)}>
                  Login
                </button>
              </h4>
            </>
            :
            <>
              <h3 className={authModalStyles["auth__header"]}>{process.env.REACT_APP_SITE_NAME} | LogIn</h3>
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
              <h4 className={authModalStyles["auth__change-form-header"]}>
                Still have no account?
                <button className={authModalStyles["auth__change-form-btn"]} onClick={() => changeSearchParam(getParams.type, getParamsEnums.type.signin, searchParams, setSearchParams)}>
                  Register
                </button>
              </h4>
            </>
        }
      </QueryModalWindow>
    )
  }
  return (
    <></>
  )
}
export default observer(AuthModal);