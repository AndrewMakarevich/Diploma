import sequelize, { OrderItem, Sequelize } from "sequelize";
import { Op } from "sequelize";
import ApiError from "../apiError/apiError";
import { IGetPictureTypesCursor } from "../interfaces/services/pictureTypesServiceInterfaces";
import models from "../models/models";
import { getCursorStatement } from "../utils/services/keysetPaginationHelpers";
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

  static async getPictureTypes(queryString: string = "", cursor: IGetPictureTypesCursor, limit?: number) {
    if (!limit) {
      limit = undefined
    }

    const literals = [
      {
        name: 'picturesAmount',
        string: '(SELECT COUNT(*) FROM pictures WHERE "pictureTypeId"="pictureType"."id")'
      }
    ];

    let cursorStatement = {};
    const whereStatement = { name: { [Op.iRegexp]: queryString } };

    if (cursor.id && cursor.value) {
      const { id, key, value, order } = cursor;
      if (cursor.key === literals[0].name) {
        cursorStatement = getCursorStatement(key, id, value, order, whereStatement, literals[0].string)
        return;
      }
      cursorStatement = getCursorStatement(key, id, value, order, whereStatement)
    }

    console.log({ ...whereStatement, ...cursorStatement });

    const orderParams = [[sequelize.col(cursor.key), cursor.order], [sequelize.col("id"), cursor.order]]

    const pictureTypes = await models.PictureType.findAll({
      where: { ...cursorStatement, ...whereStatement },
      attributes: {
        include: [
          [Sequelize.literal(literals[0].string), literals[0].name]
        ]
      },
      order: [orderParams[0] as OrderItem, orderParams[1] as OrderItem],
      limit
    });

    const pictureTypesCount = await models.PictureType.count({ where: cursorStatement });
    return { count: pictureTypesCount, rows: pictureTypes };
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