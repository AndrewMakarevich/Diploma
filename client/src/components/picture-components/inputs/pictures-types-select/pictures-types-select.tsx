import { ComponentProps, useEffect, useState } from "react";
import { pictureTypeObj } from "../../../../interfaces/http/response/picture-type-interfaces";
import PictureTypeService from "../../../../services/picture-type-service";
import MySelect, { MySelectOptionField } from "../../../../UI/my-select/my-select";

const PicturesTypesSelect = ({ onChange, value, ...restProps }: ComponentProps<"select">) => {
  const [picturesTypes, setPicturesTypes] = useState<pictureTypeObj[]>([]);
  useEffect(() => {
    PictureTypeService.getPicturesTypes("", { key: "createdAt", order: "DESC", id: 0, value: 0 }).then(response => setPicturesTypes(response.data.rows))
  }, []);

  const fields: MySelectOptionField[] = [
    {
      name: "Picture's type",
      value: ""
    },
    ...picturesTypes.map(pictureType => (
      {
        name: pictureType.name,
        value: pictureType.id
      }
    )),
  ]

  return (
    <MySelect value={value} onChange={onChange} fields={fields} {...restProps} />
  )
};

export default PicturesTypesSelect;