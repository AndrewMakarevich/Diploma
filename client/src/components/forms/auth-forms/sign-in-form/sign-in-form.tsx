import React, { ChangeEvent } from 'react';
import formStyles from '../common-form-styles.module.css';
import { IUserAuthData } from '../../../../interfaces/authentificateInterfaces';
import RegistrationBtn from '../../../btns/registration-btn/registration-btn';
import UserValidator from '../../../../validator/userValidator';
import FormInput from '../../root-form/form-input/form-input';
import { IField } from '../../root-form/interfaces';

const SignInForm = (
  { authData, setAuthData }:
    { authData: IUserAuthData, setAuthData: React.Dispatch<React.SetStateAction<IUserAuthData>> }
) => {

  const onChangeHandler = (paramName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setAuthData({ ...authData, [paramName]: event.target.value });
  }

  const fields: IField[] = [
    {
      header: "Email",
      type: "text",
      onValidate: UserValidator.validateEmail,
      onChange: onChangeHandler("email")
    },
    {
      header: "Nickname",
      type: "text",
      onValidate: UserValidator.validateNickname,
      onChange: onChangeHandler("nickname"),
    },
    {
      header: "Password",
      type: "password",
      onValidate: UserValidator.validatePassword,
      onChange: onChangeHandler("password"),
    },
    {
      header: "Repeat password",
      type: "text",
      onValidate: UserValidator.validatePassword,
      onChange: onChangeHandler("repPassword"),
    },
  ];

  return (
    <form className={formStyles["auth-form"]}>
      <ul className={formStyles["auth-input__list"]}>
        {
          fields.map(({ header, onChange, type, onValidate }) => (
            <FormInput header={header} onChange={onChange} type={type} onValidate={onValidate} />
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