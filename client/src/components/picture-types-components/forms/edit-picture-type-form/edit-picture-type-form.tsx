import { useState } from "react";
import EditForm from "../../../forms/edit-form/edit-form";
import { IGetPictureTypesResponseObj, pictureTypeObj } from "../../../../interfaces/http/response/picture-type-interfaces";
import PictureTypeService from "../../../../services/picture-type-service";
import useFetching from "../../../../hooks/useFetching";

interface IEditPictureTypeFormProps {
  initialParams: pictureTypeObj,
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  pictureTypes: IGetPictureTypesResponseObj,
  setPictureTypes: React.Dispatch<React.SetStateAction<IGetPictureTypesResponseObj>>,
}

const EditPictureTypeForm = ({ initialParams, isOpen, setIsOpen, pictureTypes, setPictureTypes }: IEditPictureTypeFormProps) => {
  const { executeCallback: editPictureType, isLoading: editPictureTypeLoading } =
    useFetching((id: number, name: string) => PictureTypeService.editPictureType(id, name));

  const onSubmit = async (editedParams: pictureTypeObj) => {
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

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button type="button" onClick={() => setIsOpen(false)}>Close</button>
      <EditForm<pictureTypeObj> initialParams={initialParams} paramsAbleToEdit={["name"]} onSubmit={onSubmit} isLoading={editPictureTypeLoading} />
    </>

  )
};

export default EditPictureTypeForm;