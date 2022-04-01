import ApiError from "../apiError/apiError";
import models from "../models/models";

class PictureTypeService {
  static async createPictureType(typeName: string) {
    const pictureType = await models.PictureType.findOne(
      {
        where:
          { name: typeName }
      }
    );

    if (pictureType) {
      throw ApiError.badRequest("This picture's type is already exists");
    };

    await models.PictureType.create({ name: typeName });

    return { message: "Picture's type created successfully" };

  };

  static async editPictureType(typeId: number, typeName: string) {
    const pictureTypeToEdit = await models.PictureType.findOne(
      {
        where:
          { id: typeId }
      }
    );

    if (!pictureTypeToEdit) {
      throw ApiError.badRequest("Picture's type you want to edit doesn't exists")
    }

    const samePictureType = await models.PictureType.findOne(
      {
        where:
          { name: typeName }
      }
    )

    if (samePictureType) {
      throw ApiError.badRequest("Picture's type name must be unique");
    }

    pictureTypeToEdit.update({ name: typeName });

    return { message: "Picture's type updated successfully" }
  };

  static async deletePictureType(typeId: number) {
    const pictureTypeToDelete = await models.PictureType.findOne(
      {
        where:
          { id: typeId }
      }
    );

    if (!pictureTypeToDelete) {
      throw ApiError.badRequest("Picture's type you want to delete doesn't exists");
    };

    await pictureTypeToDelete.destroy();

    return { message: "Picture's type deleted successfully" }
  };
}

export default PictureTypeService;