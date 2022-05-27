import formStyles from '../common-form-styles.module.css';
import LoginBtn from '../../../btns/login-btn/login-btn';
import { IUserAuthData } from '../../../../interfaces/authentificateInterfaces';
import FormInput from '../../root-form/form-input/form-input';
import { ChangeEvent, FocusEvent } from 'react';
import UserValidator from '../../../../validator/userValidator';

const SignUpForm = (
  { authData, setAuthData }:
    { authData: IUserAuthData, setAuthData: React.Dispatch<React.SetStateAction<IUserAuthData>> }
) => {

  const fieldsArr = [
    { header: "Email", paramName: "email", type: "text", validator: UserValidator.validateEmail },
    { header: "Password", paramName: "password", type: "password", validator: UserValidator.validatePassword },
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
      <LoginBtn email={authData.email} password={authData.password} />
    </form>
  )
};
export default SignUpForm;