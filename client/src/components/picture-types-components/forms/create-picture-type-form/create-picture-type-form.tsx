import { FormEvent, useState } from "react";
import PictureTypeService from "../../../../services/picture-type-service";
import { pictureTypeObj } from "../../../../interfaces/http/response/picture-type-interfaces";

import formStyles from "./create-picture-type-form.module.css";
import CreateForm from "../../../forms/create-form/create-form";

interface ICreatePictureTypeFormProps {
  actualizeList: (newPictureType: pictureTypeObj) => void;
}

const CreatePictureTypeForm = ({ actualizeList }: ICreatePictureTypeFormProps) => {
  const [typeName, setTypeName] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const createPictureType = async (e: FormEvent<HTMLButtonElement>, pictureType: { name: string }) => {
    try {
      setFormLoading(true);
      const response = await PictureTypeService.createPictureType(pictureType.name);
      await actualizeList(response.data.pictureType);
    } catch (e: any) {
      alert(e.isAxiosError ? e.response.data.message : e.message);
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <CreateForm<{ name: string }> paramsToCreate={[{ header: "Type name", paramName: "name" }]} onSubmit={createPictureType} isLoading={formLoading} />
  )
};

export default CreatePictureTypeForm;