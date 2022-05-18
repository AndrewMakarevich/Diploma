import formStyles from '../common-form-styles.module.css';
import LoginBtn from '../../../btns/login-btn/login-btn';
import { IUserAuthData } from '../../../../interfaces/authentificateInterfaces';
import AuthFormItem from '../auth-form-item/auth-form-item';

const SignUpForm = (
  { authData, setAuthData }:
    { authData: IUserAuthData, setAuthData: React.Dispatch<React.SetStateAction<IUserAuthData>> }
) => {

  const fieldsArr = [
    { header: "Email", paramName: "email" },
    { header: "Password", paramName: "password" },
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
      <LoginBtn email={authData.email} password={authData.password} />
    </form>
  )
};
export default SignUpForm;