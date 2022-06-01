import { ChangeEvent, useCallback, useState } from "react";
import useFetching from "../../../../hooks/useFetching";
import { ITagResponseObj } from "../../../../interfaces/http/response/pictureTagInterfaces";
import PictureTagService from "../../../../services/picture-tag-service";
import PictureTagValidator from "../../../../validator/picture-tag-validator";
import { IField } from "../../../forms/root-form/interfaces";
import StandartOneColumnForm from "../../../forms/standart-one-column-form/standart-one-column-form";

interface ICreatePictureTagFormProps {
  actualizeList: (newTag: ITagResponseObj) => unknown
}

const CreatePictureTagForm = ({ actualizeList }: ICreatePictureTagFormProps) => {
  const [tagToCreate, setTagToCreate] = useState({
    text: ""
  });

  const sendRequestToGetTag = useCallback(() => {
    return PictureTagService.createTag(tagToCreate.text);
  }, [tagToCreate]);

  const { executeCallback: createTag, isLoading: tagLoading } = useFetching(sendRequestToGetTag)

  const onChangeHandler = (paramName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setTagToCreate({ ...tagToCreate, [paramName]: event.target.value });
  }

  const onSubmitHandler = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    PictureTagValidator.validateTagText(tagToCreate.text)
    const response = await createTag();
    if (response) {
      actualizeList(response?.data.tag);
    }
  }, [tagToCreate, createTag, actualizeList]);

  const onClearChangesHandler = () => {
    setTagToCreate({ text: "" })
  }

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
    <div>
      <p>Create tag:</p>
      <StandartOneColumnForm
        fields={fields}
        disabled={tagLoading}
        onSubmit={onSubmitHandler}
        onClearChanges={onClearChangesHandler}
        submitButtonText="Create tag" />
    </div>
  )
};

export default CreatePictureTagForm;