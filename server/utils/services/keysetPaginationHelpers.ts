import sequelize, { Op, LogicType } from "sequelize"
import ApiError from "../../apiError/apiError";
import { ICursor } from "../../interfaces/cursor";

export function getCursorStatement(key: string, id: number, value: any, order: "ASC" | "DESC", literalString?: string) {
  if (!id || !value) {
    return {}
  };

  if (literalString) {
    return {
      [Op.or]: [
        sequelize.where(sequelize.literal(literalString), order === "DESC" ? Op.lt : Op.gt, value as LogicType),
        {
          [Op.and]: [
            sequelize.where(sequelize.literal(literalString), Op.eq, value as LogicType),
            {
              "id": { [order === "DESC" ? Op.lt : Op.gt]: id },
            }
          ]
        }
      ]
    }
  };

  return {
    [Op.or]: [
      { [key]: { [order === "DESC" ? Op.lt : Op.gt]: value } },
      { [key]: { [Op.eq]: value }, "id": { [order === "DESC" ? Op.lt : Op.gt]: id } },
    ],
  };
};

export function objectIsCursor(cursor: any): ICursor | never {
  try {
    const parsedCursor: ICursor = typeof cursor === "object" ? cursor : JSON.parse(cursor);
    const { id, key, value, order } = parsedCursor;

    if (typeof id === "number" &&
      typeof key === "string" &&
      (typeof value === "string" || typeof value === "number") &&
      (order === "ASC" || order === "DESC")) {
      return parsedCursor;
    } else {
      throw ApiError.badRequest(",m");
    }
  } catch (e: any) {
    console.log(e.message)
    throw ApiError.badRequest(e.message);
  }
};