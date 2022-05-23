import sequelize, { Op, LogicType } from "sequelize"

export function getCursorStatement(key: string, id: number, value: any, order: "ASC" | "DESC", whereStatement: object, literalString?: string) {
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
  }
  return {
    [Op.or]: [
      { [key]: { [order === "DESC" ? Op.lt : Op.gt]: value } },
      { [key]: { [Op.eq]: value }, "id": { [order === "DESC" ? Op.lt : Op.gt]: id } },
    ],
  }
}