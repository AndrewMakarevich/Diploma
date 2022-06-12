export interface sectionObj {
  [key: string]: any,
  id: number,
  title: string,
  description: string,
  alreadyExists?: boolean,
  toDelete?: boolean
}

export interface tagObj {
  [key: string]: any,
  id: number,
  text: string,
  alreadyExists?: boolean,
  toDelete?: boolean
}

export interface IEditPictureFormProps {
  pictureId: number,
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}