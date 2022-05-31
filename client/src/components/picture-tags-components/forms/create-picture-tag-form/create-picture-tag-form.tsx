import { ChangeEvent, useCallback, useState } from "react";
import useFetching from "../../../../hooks/useFetching";
import { ITagResponseObj } from "../../../../interfaces/http/response/pictureTagInterfaces";
import PictureTagService from "../../../../services/picture-tag-service";
import DeleteButton from "../../../../UI/delete-button/delete-button";
import StandartButton from "../../../../UI/standart-button/standart-button";
import PictureTagValidator from "../../../../validator/picture-tag-validator";
import FormInput from "../../../forms/root-form/form-input/form-input";
import { IField } from "../../../forms/root-form/interfaces";

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

  const onSubmit = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    PictureTagValidator.validateTagText(tagToCreate.text)
    const response = await createTag();
    if (response) {
      actualizeList(response?.data.tag);
    }
  }, [tagToCreate, createTag, actualizeList]);

  const onClearInputs = () => {
    setTagToCreate({ text: "" })
  }

  const inputs: IField[] = [
    {
      header: "Tag text",
      type: "text",
      value: tagToCreate.text,
      onChange: onChangeHandler("text"),
      onValidate: PictureTagValidator.validateTagText,
      disabled: tagLoading
    }
  ];
  return (
    <div>
      <p>Create tag:</p>
      <form>
        {
          inputs.map(({ header, onChange, onValidate, type, disabled, value }) => (
            <FormInput header={header} type={type} onChange={onChange} onValidate={onValidate} disabled={disabled} value={value} />
          ))
        }
        <StandartButton disabled={tagLoading} type="submit" onClick={onSubmit}>Create</StandartButton>
        <DeleteButton disabled={tagLoading} type="button" onClick={onClearInputs}>Clear</DeleteButton>
      </form>
    </div>
  )
};

export default CreatePictureTagForm;