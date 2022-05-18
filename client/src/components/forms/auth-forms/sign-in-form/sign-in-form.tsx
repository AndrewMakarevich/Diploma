import React from 'react';
import formStyles from '../common-form-styles.module.css';
import { IUserAuthData } from '../../../../interfaces/authentificateInterfaces';
import RegistrationBtn from '../../../btns/registration-btn/registration-btn';
import AuthFormItem from '../auth-form-item/auth-form-item';

const SignInForm = (
  { authData, setAuthData }:
    { authData: IUserAuthData, setAuthData: React.Dispatch<React.SetStateAction<IUserAuthData>> }
) => {
  const fieldsArr = [
    { header: "Email", paramName: "email" },
    { header: "Nickname", paramName: "nickname" },
    { header: "Password", paramName: "password" },
    { header: "Repeat password", paramName: "repPassword" },
  ];


  return (
    <form className={formStyles["auth-form"]}>
      <ul className={formStyles["auth-input__list"]}>
        {
          fieldsArr.map(field => (
            <AuthFormItem authData={authData} setAuthData={setAuthData} header={field.header} paramName={field.paramName} />
          ))
        }
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