import { useContext } from "react";
import { Context } from "../../..";
import useFetching from "../../../hooks/useFetching";
import UserValidator from "../../../validator/userValidator";

const ResetPassBtn = ({ id, newPass, repeatNewPass }: { id?: string, newPass: string, repeatNewPass: string }) => {
  const { userStore } = useContext(Context);
  async function sendResetPassRequest(newPass: string, repeatNewPass: string) {
    if (!newPass) {
      return;
    }
    if (newPass !== repeatNewPass) {
      alert("Incorrect password repeat");
      return;
    }
    if (!UserValidator.validatePassword(newPass, "New password doesn't match specified pattern")) {
      return;
    }

    await userStore.resetMyPassword(newPass);
  }
  const { executeCallback: resetPassword, isLoading: resetIsLoading } = useFetching(() => sendResetPassRequest(newPass, repeatNewPass));

  return (
    <button id={id} onClick={
      (e) => {
        e.preventDefault();
        resetPassword();
      }
    }
      disabled={resetIsLoading}>Reset password</button>
  )
};
export default ResetPassBtn;