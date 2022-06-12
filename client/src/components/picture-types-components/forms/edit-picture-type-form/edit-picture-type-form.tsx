import { pictureTypeObj } from "../../../../interfaces/http/response/picture-type-interfaces";
import PictureTypeService from "../../../../services/picture-type-service";
import useFetching from "../../../../hooks/useFetching";

import formStyles from "./edit-picture-type-form.module.css";
import { useCallback, useEffect, useState } from "react";
import PictureTypeValidator from "../../../../validator/picture-type-validator";
import StandartOneColumnForm from "../../../forms/standart-one-column-form/standart-one-column-form";
import { IField } from "../../../forms/root-form/interfaces";
import checkAllowToEdit from "../../../../utils/check-allow-to-edit";

interface IEditPictureTypeFormProps {
  initialParams: pictureTypeObj,
  actualizeList: (pictureType: pictureTypeObj) => void
}

const EditPictureTypeForm = ({ initialParams, actualizeList }: IEditPictureTypeFormProps) => {
  const [editedParams, setEditedParams] = useState<pictureTypeObj>({
    id: 0,
    createdAt: "",
    updatedAt: "",
    name: "",
    picturesAmount: 0,
    userId: 0
  });

  const onSubmit = useCallback(async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (!initialParams) {
      return;
    }

    const freezedParams = editedParams;

    if (!checkAllowToEdit(editedParams, initialParams)) {
      return;
    }

    PictureTypeValidator.validateTypeName(editedParams.name, true);
    const response = await PictureTypeService.editPictureType(editedParams.id, editedParams.name)
    alert(response?.data.message);
    actualizeList(freezedParams);
  }, [editedParams, initialParams, actualizeList]);

  const { executeCallback: submitChanges, isLoading: submitLoading } = useFetching(onSubmit)

  const onChangeHandler = (paramName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedParams({ ...editedParams, [paramName]: event.target.value });
  }

  const onClearChanges = useCallback(() => {
    setEditedParams(initialParams);
  }, [initialParams]);

  const fields: IField[] = [
    {
      header: "Type name",
      type: "text",
      value: editedParams["name"],
      onChange: onChangeHandler("name"),
      onValidate: PictureTypeValidator.validateTypeName
    }
  ]

  useEffect(() => {
    if (initialParams) {
      setEditedParams(initialParams);
    }
  }, [initialParams]);

  return (
    <div className={formStyles["form-wrapper"]}>
      <p className={formStyles["form-header"]}>Edit picture type</p>
      <StandartOneColumnForm fields={fields} onClearChanges={onClearChanges} onSubmit={submitChanges} disabled={submitLoading} />
    </div>
  )
};

export default EditPictureTypeForm;