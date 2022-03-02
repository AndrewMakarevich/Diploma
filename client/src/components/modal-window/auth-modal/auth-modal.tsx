import { useContext, useEffect, useState } from "react";
import { observer } from 'mobx-react-lite'
import { Context } from "../../..";
import useQueryParam from "../../../hooks/useQueryParam";
import QueryModalWindow from "../query-modal-window"
import { getParams, getParamsEnums } from "../../../consts/popup-routes";
import { useSearchParams } from "react-router-dom";

const AuthModal = () => {
  const { modalStore, userStore } = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();
  const [authData, setAuthData] = useState({
    email: '',
    nickname: '',
    password: ''
  });
  useEffect(() => {
    console.log(authData);
  }, [authData]);
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
      <QueryModalWindow>
        {
          type === 'sign-in' ?
            <>
              <h3>SignIn</h3>
              <ul className="auth-input__list">
                <li className="auth-input__item">
                  <label>
                    Email
                    <input value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })}></input>
                  </label>
                </li>
                <li className="auth-input__item">
                  <label>
                    Nickname
                    <input value={authData.nickname} onChange={(e) => setAuthData({ ...authData, nickname: e.target.value })}></input>
                  </label>
                </li>
                <li className="auth-input__item">
                  <label>
                    Password
                    <input value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })}></input>
                  </label>
                </li>
                <li className="auth-input__item">
                  <label>
                    Repeat password
                    <input></input>
                  </label>
                </li>
              </ul>
              <button onClick={() => userStore.registration(authData.email, authData.nickname, authData.password)}>Registrate</button>
              <h4>Already have an account? <button onClick={() => changeSearchParam(getParams.type, getParamsEnums.type.signup, searchParams, setSearchParams)}>Login</button></h4>
            </>
            :
            <>
              <h3>SignUp</h3>
              <ul className="auth-input__list">
                <li className="auth-input__item">
                  <label>
                    Email
                    <input value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })}></input>
                  </label>
                </li>
                <li className="auth-input__item">
                  <label>
                    Password
                    <input value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })}></input>
                  </label>
                </li>
              </ul>
              <button onClick={() => userStore.login(authData.email, authData.password)}>Authentificate</button>
              <h4>Still have no account?<button onClick={() => changeSearchParam(getParams.type, getParamsEnums.type.signin, searchParams, setSearchParams)}>Register</button></h4>
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