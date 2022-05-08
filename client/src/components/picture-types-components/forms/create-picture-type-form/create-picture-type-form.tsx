import { useState } from "react";
import PictureTypeService from "../../../../services/picture-type-service";
import { pictureTypeObj } from "../../../../interfaces/http/response/picture-type-interfaces";

interface ICreatePictureTypeFormProps {
  actualizeList: (newPictureType: pictureTypeObj) => void;
}

const CreatePictureTypeForm = ({ actualizeList }: ICreatePictureTypeFormProps) => {
  const [typeName, setTypeName] = useState("");

  const createPictureType = async () => {
    try {
      const response = await PictureTypeService.createPictureType(typeName);
      await actualizeList(response.data.pictureType);
    } catch (e: any) {
      alert(e.isAxiosError ? e.response.data.message : e.message);
    }
  }

  return (
    <form>
      <input value={typeName} onChange={(e) => setTypeName(e.target.value)}></input>
      <button type="button" onClick={() => setTypeName("")}>Clear input</button>
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          createPictureType();
        }}>Create type</button>
    </form>
  )
};

export default CreatePictureTypeForm;