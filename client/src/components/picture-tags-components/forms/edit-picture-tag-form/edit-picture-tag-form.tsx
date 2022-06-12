import { ChangeEvent, useCallback, useEffect, useState } from "react";
import useFetching from "../../../../hooks/useFetching";
import { ITagResponseObj } from "../../../../interfaces/http/response/pictureTagInterfaces";
import PictureTagService from "../../../../services/picture-tag-service";
import checkAllowToEdit from "../../../../utils/check-allow-to-edit";
import PictureTagValidator from "../../../../validator/picture-tag-validator";
import { IField } from "../../../forms/root-form/interfaces";
import StandartOneColumnForm from "../../../forms/standart-one-column-form/standart-one-column-form";

import formStyles from "./edit-picture-tag-form.module.css";

interface IEditPictureTagFormProps {
  initialParams: ITagResponseObj,
  actualizeList: (tagId: number, tagText: string) => void
}

const EditPictureTagForm = ({ initialParams, actualizeList }: IEditPictureTagFormProps) => {
  const [paramsToEdit, setParamsToEdit] = useState({
    id: 0,
    text: ""
  });

  const sendRequestToEditTag = useCallback(async () => {
    const { id, text } = paramsToEdit;

    if (!checkAllowToEdit(paramsToEdit, initialParams)) {
      return;
    }

    PictureTagValidator.validateTagText(text, true);
    const response = await PictureTagService.editTag(id, text);
    alert(response.data.message);
    actualizeList(id, text);
  }, [actualizeList, paramsToEdit, initialParams]);

  const { executeCallback: editTag, isLoading: tagLoading } = useFetching(sendRequestToEditTag)

  const onChangeHandler = (paramName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setParamsToEdit({ ...paramsToEdit, [paramName]: event.target.value })
  };

  const onClearChangesHandler = () => {
    if (initialParams) {
      setParamsToEdit(initialParams);
    }
  }

  const onSubmitHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    editTag();
  };


  const fields: IField[] = [
    {
      type: "text",
      header: "Tag text",
      value: paramsToEdit.text,
      onValidate: PictureTagValidator.validateTagText,
      onChange: onChangeHandler("text"),
    }
  ];

  useEffect(() => {
    if (initialParams) {
      setParamsToEdit(initialParams);
    }
  }, [initialParams]);

  return (
    <div className={formStyles["form-wrapper"]}>
      <p className={formStyles["form-header"]}>Edit tag:</p>
      <StandartOneColumnForm
        fields={fields}
        disabled={tagLoading}
        onSubmit={onSubmitHandler}
        onClearChanges={onClearChangesHandler}
        clearButtonText="Clear changes" />
    </div>
  )
};

export default EditPictureTagForm;