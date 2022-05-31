import { ChangeEvent, useCallback, useEffect, useState } from "react";
import useFetching from "../../../../hooks/useFetching";
import { ITagResponseObj } from "../../../../interfaces/http/response/pictureTagInterfaces";
import PictureTagService from "../../../../services/picture-tag-service";
import DeleteButton from "../../../../UI/delete-button/delete-button";
import StandartButton from "../../../../UI/standart-button/standart-button";
import PictureTagValidator from "../../../../validator/picture-tag-validator";
import FormInput from "../../../forms/root-form/form-input/form-input";
import { IField } from "../../../forms/root-form/interfaces";

interface IEditPictureTagFormProps {
  initialParams?: ITagResponseObj,
  actualizeList: (tagId: number, tagText: string) => void
}

const EditPictureTagForm = ({ initialParams, actualizeList }: IEditPictureTagFormProps) => {
  const [paramsToEdit, setParamsToEdit] = useState({
    id: 0,
    text: ""
  });

  const sendRequestToEditTag = useCallback(async () => {
    const { id, text } = paramsToEdit;
    const response = await PictureTagService.editTag(id, text);
    alert(response.data.message);
    actualizeList(id, text);
  }, [actualizeList, paramsToEdit]);

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
      disabled: tagLoading
    }
  ];

  useEffect(() => {
    if (initialParams) {
      setParamsToEdit(initialParams);
    }
  }, [initialParams])
  return (
    <div>
      <p>Edit tag:</p>
      <form>
        {
          fields.map(({ type, header, value, onValidate, onChange, disabled }) => (
            <FormInput type={type} header={header} value={value} onValidate={onValidate} onChange={onChange} disabled={disabled} />
          ))
        }
        <StandartButton type="submit" onClick={onSubmitHandler}>Submit</StandartButton>
        <StandartButton type="button" onClick={onClearChangesHandler}>Clear changes</StandartButton>
        <DeleteButton type="button">Close</DeleteButton>
      </form>
    </div>
  )
};

export default EditPictureTagForm;