export interface IPictureMainDataEditForm {
  [key: string]: any;
  img: string | null,
  mainTitle: string,
  description: string,
  pictureTypeId: string | null
}

export interface IEditedPictureMainDataEditForm {
  [key: string]: any;
  img: File | string | undefined | null,
  mainTitle: string,
  description: string,
  pictureTypeId: string | null
}