import { Model } from "sequelize"

export interface IPictureInstance extends Model {
  id: number,
  userId: number,
  img: string,
  mainTitle: string,
  description: string,
  createdAt: string,
  updatedAt: string
}

export interface IPictureInfo {
  id: number,
  title: string,
  description: string
};
export interface IPictureInfoInstance extends IPictureInfo, Model { };