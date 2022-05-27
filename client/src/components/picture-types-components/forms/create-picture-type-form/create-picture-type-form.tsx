import { FocusEvent, FormEvent, useState } from "react";
import PictureTypeService from "../../../../services/picture-type-service";
import { pictureTypeObj } from "../../../../interfaces/http/response/picture-type-interfaces";

import formStyles from "./create-picture-type-form.module.css";
import FormInput from "../../../forms/root-form/form-input/form-input";
import StandartButton from "../../../../UI/standart-button/standart-button";
import DeleteButton from "../../../../UI/delete-button/delete-button";
import PictureTypeValidator from "../../../../validator/picture-type-validator";

interface ICreatePictureTypeFormProps {
  actualizeList: (newPictureType: pictureTypeObj) => void;
}

const CreatePictureTypeForm = ({ actualizeList }: ICreatePictureTypeFormProps) => {
  const [typeName, setTypeName] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const createPictureType = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const response = await PictureTypeService.createPictureType(typeName);
      await actualizeList(response.data.pictureType);
    } catch (e: any) {
      alert(e.isAxiosError ? e.response.data.message : e.message);
    } finally {
      setFormLoading(false);
    }
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeName(e.target.value)
  }

  const onValidateHandler = (validator: (paramName: string, alert: boolean) => boolean) => (e: FocusEvent<HTMLInputElement>) => {
    validator(e.target.value, true);
  }

  const onClearChangesHandler = () => {
    setTypeName("");
  }

  return (
    <div className={formStyles["form-wrapper"]}>
      <p className={formStyles["form-header"]}>Create picture type</p>
      <form className={formStyles["form"]}>
        <FormInput disabled={formLoading} value={typeName} type="text" header="Type name" onChange={onChangeHandler} onValidate={onValidateHandler(PictureTypeValidator.validateTypeName)} />
        <StandartButton disabled={formLoading} type="submit" onClick={createPictureType}>Create</StandartButton>
        <DeleteButton disabled={formLoading} type="button" onClick={onClearChangesHandler}>Clear</DeleteButton>
      </form>
    </div>
  )
};

export default CreatePictureTypeForm;