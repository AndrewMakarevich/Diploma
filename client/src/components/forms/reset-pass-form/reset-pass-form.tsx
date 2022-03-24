import formStyles from "./reset-pass-form.module.css";
import { useState } from "react";
import ResetPassBtn from "../../btns/reset-pass-btn/reset-pass-btn";

const ResetPassForm = () => {
  const [resetPassData, setResetPassData] = useState({
    newPass: "",
    repeatNewPass: ""
  })
  return (
    <form className={formStyles["form"]}>
      <p className={formStyles["form__header"]}>Reset password section</p>
      <hr></hr>
      <label className={formStyles["form__label"]}>
        New password:
        <input className={formStyles["form__input"]} onChange={(e) => setResetPassData({ ...resetPassData, newPass: e.target.value })}></input>
      </label>

      <label className={formStyles["form__label"]}>
        Repeat new password:
        <input className={formStyles["form__input"]} onChange={(e) => setResetPassData({ ...resetPassData, repeatNewPass: e.target.value })}></input>
      </label>

      <ResetPassBtn id={formStyles["reset-pass-btn"]} newPass={resetPassData.newPass} repeatNewPass={resetPassData.repeatNewPass} />
    </form>
  )
};
export default ResetPassForm;