import formStyles from '../common-form-styles.module.css';
import LoginBtn from '../../../btns/login-btn/login-btn';
import { IUserAuthData } from '../../../../interfaces/authentificateInterfaces';
import FormInput from '../../root-form/form-input/form-input';
import { ChangeEvent, FocusEvent } from 'react';
import UserValidator from '../../../../validator/userValidator';
import { IField } from '../../root-form/interfaces';

const SignUpForm = (
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
      header: "Password",
      type: "password",
      onValidate: UserValidator.validatePassword,
      onChange: onChangeHandler("password"),
    }
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
      <LoginBtn email={authData.email} password={authData.password} />
    </form>
  )
};
export default SignUpForm;