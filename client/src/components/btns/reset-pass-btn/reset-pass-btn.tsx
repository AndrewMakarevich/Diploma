import { useContext } from "react";
import { Context } from "../../..";
import useFetching from "../../../hooks/useFetching";
import UserValidator from "../../../validator/userValidator";

const ResetPassBtn = ({ id, oldPass, newPass, repeatNewPass }: { id?: string, oldPass: string, newPass: string, repeatNewPass: string }) => {
  const { userStore } = useContext(Context);
  async function sendResetPassRequest(oldPass: string, newPass: string, repeatNewPass: string) {
    if (!oldPass || !newPass) {
      return;
    }
    if (newPass !== repeatNewPass) {
      alert("Incorrect password repeat");
      return;
    }
    if (!UserValidator.validatePassword(newPass, "New password doesn't match specified pattern")) {
      return;
    }

    await userStore.resetMyPassword(oldPass, newPass);
  }
  const { executeCallback: resetPassword, isLoading: resetIsLoading } = useFetching(() => sendResetPassRequest(oldPass, newPass, repeatNewPass));

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