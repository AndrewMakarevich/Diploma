export interface IUserDataToEdit {
  [key: string]: any,
  avatar: File | undefined,
  profileBackground: File | undefined,
  nickname: string,
  firstName: string,
  surname: string,
  country: string,
  city: string
}