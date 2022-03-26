import authModalStyles from './auth-modal.module.css'
import { useContext, useState } from "react";
import { observer } from 'mobx-react-lite'
import { Context } from "../../..";
import useQueryParam from "../../../hooks/useQueryParam";
import QueryModalWindow from "../query-modal-window"
import { getParams, getParamsEnums } from "../../../consts/popup-routes";
import { useSearchParams } from "react-router-dom";
import SignInForm from '../../forms/auth-forms/sign-in-form/sign-in-form';
import SignUpForm from '../../forms/auth-forms/sign-up-form/sign-up-form';

const AuthModal = () => {
  const { modalStore } = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();
  const [authData, setAuthData] = useState({
    email: '',
    nickname: '',
    password: '',
    repPassword: ''
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
              <SignInForm authData={authData} setAuthData={setAuthData} />
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
              <SignUpForm authData={authData} setAuthData={setAuthData} />
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