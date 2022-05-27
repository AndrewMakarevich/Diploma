import { IGetPictureTypesResponseObj, pictureTypeObj } from "../../../../interfaces/http/response/picture-type-interfaces";
import PictureTypeService from "../../../../services/picture-type-service";
import useFetching from "../../../../hooks/useFetching";

import formStyles from "./edit-picture-type-form.module.css";
import DeleteButton from "../../../../UI/delete-button/delete-button";
import FormInput from "../../../forms/root-form/form-input/form-input";
import { useEffect, useState } from "react";
import PictureTypeValidator from "../../../../validator/picture-type-validator";
import StandartButton from "../../../../UI/standart-button/standart-button";

interface ITypeParamsAbleToEdit {
  name: string;
}

interface IEditPictureTypeFormProps {
  initialParams: pictureTypeObj,
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  pictureTypes: IGetPictureTypesResponseObj,
  setPictureTypes: React.Dispatch<React.SetStateAction<IGetPictureTypesResponseObj>>,
}

const EditPictureTypeForm = ({ initialParams, isOpen, setIsOpen, pictureTypes, setPictureTypes }: IEditPictureTypeFormProps) => {
  const [editedParams, setEditedParams] = useState<ITypeParamsAbleToEdit>({
    name: "",
  });
  const { executeCallback: editPictureType, isLoading: editPictureTypeLoading } =
    useFetching((id: number, name: string) => PictureTypeService.editPictureType(id, name));

  const onSubmit = (editedParams: ITypeParamsAbleToEdit) => async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (!initialParams) {
      return;
    }
    try {
      await editPictureType(initialParams.id, editedParams.name);

      if (!pictureTypes.rows.some(pictureType => +pictureType.id === +initialParams.id)) {
        return;
      }

      const updatedPictureTypesRowsArr = pictureTypes.rows.map(pictureType => {
        if (+pictureType.id === +initialParams.id) {
          return { ...pictureType, name: editedParams.name }
        };

        return pictureType
      });

      setPictureTypes({ ...pictureTypes, rows: updatedPictureTypesRowsArr });
    } catch (e: any) {
      alert(e.isAxiosError ? e.response.data.message : e.message);
    }
  };

  const onChangeHandler = (paramName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedParams({ ...editedParams, [paramName]: event.target.value });
  }

  const onValidateHandler = (validator: Function) => (event: React.FocusEvent<HTMLInputElement, Element>) => {
    validator(event.target.value);
  }

  const onClearChanges = () => {
    setEditedParams(initialParams);
  }

  useEffect(() => {
    if (initialParams) {
      setEditedParams(initialParams);
    }
  }, [initialParams]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={formStyles["form-wrapper"]}>
      <p className={formStyles["form-header"]}>Edit picture type</p>
      <form className={formStyles["form"]}>
        <FormInput
          disabled={editPictureTypeLoading}
          value={editedParams["name"]}
          header="Type name"
          onChange={onChangeHandler("name")}
          type="text"
          onValidate={onValidateHandler(PictureTypeValidator.validateTypeName)} />
        <StandartButton disabled={editPictureTypeLoading} type="submit" onClick={onSubmit(editedParams)}>Submit changes</StandartButton>
        <StandartButton disabled={editPictureTypeLoading} type="button" onClick={onClearChanges}>Clear changes</StandartButton>
        <DeleteButton disabled={editPictureTypeLoading} type="button" onClick={() => setIsOpen(false)}>Close</DeleteButton>
      </form>
    </div>
  )
};

export default EditPictureTypeForm;