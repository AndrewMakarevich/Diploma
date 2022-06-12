import { ChangeEvent, useCallback, useState } from "react";
import useFetching from "../../../../hooks/useFetching";
import { ITagResponseObj } from "../../../../interfaces/http/response/pictureTagInterfaces";
import PictureTagService from "../../../../services/picture-tag-service";
import PictureTagValidator from "../../../../validator/picture-tag-validator";
import { IField } from "../../../forms/root-form/interfaces";
import StandartOneColumnForm from "../../../forms/standart-one-column-form/standart-one-column-form";

import formStyles from "./create-picture-tag-form.module.css";

interface ICreatePictureTagFormProps {
  actualizeList: (newTag: ITagResponseObj) => unknown
}

const CreatePictureTagForm = ({ actualizeList }: ICreatePictureTagFormProps) => {
  const [tagToCreate, setTagToCreate] = useState({
    text: ""
  });

  const onChangeHandler = (paramName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setTagToCreate({ ...tagToCreate, [paramName]: event.target.value });
  };

  const onSubmitHandler = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    PictureTagValidator.validateTagText(tagToCreate.text);

    const response = await PictureTagService.createTag(tagToCreate.text);

    alert(response.data.message);
    actualizeList({ ...response?.data.tag, attachedPicturesAmount: "0" });
  }, [tagToCreate, actualizeList]);

  const { executeCallback: submitChanges, isLoading: submitLoading } = useFetching(onSubmitHandler)

  const onClearChangesHandler = () => {
    setTagToCreate({ text: "" })
  };

  const fields: IField[] = [
    {
      header: "Tag text",
      type: "text",
      value: tagToCreate.text,
      onChange: onChangeHandler("text"),
      onValidate: PictureTagValidator.validateTagText,
    }
  ];

  return (
    <div className={formStyles["form-wrapper"]}>
      <p className={formStyles["form-header"]}>Create tag:</p>
      <StandartOneColumnForm
        fields={fields}
        disabled={submitLoading}
        onSubmit={submitChanges}
        onClearChanges={onClearChangesHandler}
        submitButtonText="Create tag" />
    </div>
  )
};

export default CreatePictureTagForm;