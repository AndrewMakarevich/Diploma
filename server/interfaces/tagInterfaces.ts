import { Model } from "sequelize";

export interface IPictureTag {
  id: number,
  text: string,
}
export interface IPictureTagInstance extends IPictureTag, Model {
  createdAt: string,
  updatedAt: string
}

export interface IPicturesTags {
  pictureId: number,
  pictureTagId: number
}

export interface IPicturesTagsInstance extends IPicturesTags, Model {
  createdAt: string,
  updatedAt: string
};