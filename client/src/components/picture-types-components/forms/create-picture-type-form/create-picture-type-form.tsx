import { FormEvent, useState } from "react";
import PictureTypeService from "../../../../services/picture-type-service";
import { pictureTypeObj } from "../../../../interfaces/http/response/picture-type-interfaces";

import formStyles from "./create-picture-type-form.module.css";
import PictureTypeValidator from "../../../../validator/picture-type-validator";
import StandartOneColumnForm from "../../../forms/standart-one-column-form/standart-one-column-form";
import { IField } from "../../../forms/root-form/interfaces";

interface ICreatePictureTypeFormProps {
  actualizeList: (newPictureType: pictureTypeObj) => void;
}

const CreatePictureTypeForm = ({ actualizeList }: ICreatePictureTypeFormProps) => {
  const [typeName, setTypeName] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const createPictureType = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      PictureTypeValidator.validateTypeName(typeName, true);
      setFormLoading(true);

      const response = await PictureTypeService.createPictureType(typeName);
      alert(response.data.message);

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

  const onClearChangesHandler = () => {
    setTypeName("");
  }

  const fields: IField[] = [
    {
      header: "Type name",
      onChange: onChangeHandler,
      onValidate: PictureTypeValidator.validateTypeName,
      type: "text",
      value: typeName,
    }
  ]

  return (
    <div className={formStyles["form-wrapper"]}>
      <p className={formStyles["form-header"]}>Create picture type</p>
      <StandartOneColumnForm
        fields={fields} disabled={formLoading} onSubmit={createPictureType} onClearChanges={onClearChangesHandler} />
    </div>
  )
};

export default CreatePictureTypeForm;