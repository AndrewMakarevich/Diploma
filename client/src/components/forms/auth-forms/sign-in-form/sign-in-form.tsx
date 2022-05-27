import React, { ChangeEvent, FocusEvent } from 'react';
import formStyles from '../common-form-styles.module.css';
import { IUserAuthData } from '../../../../interfaces/authentificateInterfaces';
import RegistrationBtn from '../../../btns/registration-btn/registration-btn';
import AuthFormItem from '../auth-form-item/auth-form-item';
import UserValidator from '../../../../validator/userValidator';
import FormInput from '../../root-form/form-input/form-input';

const SignInForm = (
  { authData, setAuthData }:
    { authData: IUserAuthData, setAuthData: React.Dispatch<React.SetStateAction<IUserAuthData>> }
) => {
  const fieldsArr = [
    { header: "Email", paramName: "email", type: "text", validator: UserValidator.validateEmail },
    { header: "Nickname", paramName: "nickname", type: "text", validator: UserValidator.validateNickname },
    { header: "Password", paramName: "password", type: "text", validator: UserValidator.validatePassword },
    { header: "Repeat password", paramName: "repPassword", type: "text", validator: UserValidator.validatePassword },
  ];

  const onChangeHandler = (paramName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setAuthData({ ...authData, [paramName]: event.target.value });
  }

  const onValidateHandler = (validator: (paramValue: string, alert: boolean) => boolean) => (e: FocusEvent<HTMLInputElement>) => {
    validator(e.target.value, true);
  }


  return (
    <form className={formStyles["auth-form"]}>
      <ul className={formStyles["auth-input__list"]}>
        {
          fieldsArr.map(({ header, paramName, type, validator }) => (
            <FormInput header={header} onChange={onChangeHandler(paramName)} type={type} onValidate={onValidateHandler(validator)} />
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