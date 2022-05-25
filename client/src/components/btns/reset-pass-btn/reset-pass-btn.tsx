import { ComponentProps, useContext } from "react";
import { Context } from "../../..";
import useFetching from "../../../hooks/useFetching";
import StandartButton from "../../../UI/standart-button/standart-button";
import UserValidator from "../../../validator/userValidator";

interface IResetPassBtnProps extends ComponentProps<"button"> {
  newPass: string;
  repeatNewPass: string;
}

const ResetPassBtn = ({
  newPass,
  repeatNewPass,
  id,
  onClick,
  children,
  ...restProps
}: IResetPassBtnProps) => {
  const { userStore } = useContext(Context);
  async function sendResetPassRequest(newPass: string, repeatNewPass: string) {
    if (!newPass) {
      return;
    }

    if (newPass !== repeatNewPass) {
      alert("Incorrect password repeat");
      return;
    }

    try {
      UserValidator.validatePassword(newPass)
    } catch (e) {
      alert(e);
      return;
    }

    await userStore.resetMyPassword(newPass);
  }

  const { executeCallback: resetPassword, isLoading: resetIsLoading } =
    useFetching(() => sendResetPassRequest(newPass, repeatNewPass));

  const resetPassClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (onClick) {
      onClick(e);
    }

    resetPassword();
  }

  return (
    <StandartButton
      id={id}
      onClick={resetPassClickHandler}
      disabled={resetIsLoading}
      {...restProps}
    >
      {children || "Reset password"}
    </StandartButton>
  );
};
export default ResetPassBtn;
