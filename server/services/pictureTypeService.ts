import sequelize, { OrderItem, Sequelize } from "sequelize";
import { Op } from "sequelize";
import ApiError from "../apiError/apiError";
import models from "../models/models";
import PictureValidator from "../validator/pictureValidator";

class PictureTypeService {
  static async checkPictureTypeExistence(typeId: number) {
    if (typeId === undefined) {
      return;
    }
    const pictureType = await models.PictureType.findOne({ where: { id: typeId } });
    if (!pictureType) {
      throw ApiError.badRequest("Such picture's type doesn't exists, if you are an admin, you can create new picture's type")
    };
    return;
  }

  static async getPictureTypes(queryString?: string, sort?: string, page?: number, limit?: number) {

    console.log(sort);

    let sortParam;
    try {
      if (sort) {
        if (Array.isArray(sort) && sort.length === 2) {
          sortParam = sort;
        } else if (typeof sort === "string") {
          const parsedSortParam = JSON.parse(sort);
          if (Array.isArray(parsedSortParam) && parsedSortParam.length === 2) {
            sortParam = parsedSortParam;
          }
        }
      }

      if (!sortParam) {
        sortParam = ["createdAt", "DESC"]
      }

    } catch (e) {
      throw ApiError.badRequest("Incorrect sort param");
    }

    const limitValue = limit || undefined;
    const pageValue = page || 1;
    const offsetValue = (pageValue - 1) * (limitValue || 1);

    const pictureTypes = await models.PictureType.findAndCountAll({
      attributes: {
        include: [
          [Sequelize.literal(`(SELECT COUNT(*) FROM pictures WHERE "pictureTypeId"="pictureType"."id")`), "picturesAmount"]
        ]
      },
      order: [[sequelize.col(sortParam[0]), sortParam[1]]],
      limit: limitValue,
      offset: offsetValue
    });
    return pictureTypes;
  };

  static async createPictureType(typeName: string, userId: number) {
    if (!typeName) {
      throw ApiError.badRequest("Not enough data");
    }
    PictureValidator.validatePictureType(typeName, true);
    const pictureType = await models.PictureType.findOne(
      {
        where:
          { name: typeName }
      }
    );

    if (pictureType) {
      throw ApiError.badRequest("This picture's type is already exists");
    };

    const createPictureType = await models.PictureType.create({ name: typeName, userId });

    return { message: "Picture's type created successfully", pictureType: createPictureType };

  };

  static async editPictureType(typeId: number, typeName: string, userId: number) {
    PictureValidator.validatePictureType(typeName, true);

    const samePictureType = await models.PictureType.findOne(
      {
        where:
          { name: typeName }
      }
    );

    if (samePictureType) {
      throw ApiError.badRequest("Picture's type name must be unique");
    };

    const pictureTypeToEdit = await models.PictureType.findOne(
      {
        where:
          { id: typeId }
      }
    );

    if (!pictureTypeToEdit) {
      throw ApiError.badRequest("Picture's type you want to edit doesn't exists")
    };

    pictureTypeToEdit.update({ name: typeName, userId });

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