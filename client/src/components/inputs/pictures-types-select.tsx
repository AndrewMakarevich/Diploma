import { useEffect, useState } from "react";
import { pictureTypeObj } from "../../interfaces/http/response/pictureTypeInrefaces";
import PictureTypeService from "../../services/picture-type-service";

const PicturesTypesSelect = ({ onChange }: { onChange: Function }) => {
  const [picturesTypes, setPicturesTypes] = useState<pictureTypeObj[]>();
  useEffect(() => {
    PictureTypeService.getPicturesTypes().then(response => setPicturesTypes(response.data))
  }, []);

  return (
    <select onChange={(e) => onChange(e)}>
      <option></option>
      {
        picturesTypes?.length && picturesTypes.map(pictureType =>
          <option key={pictureType.id} value={pictureType.id}>{pictureType.name}</option>
        )
      }
    </select>
  )
};

export default PicturesTypesSelect;