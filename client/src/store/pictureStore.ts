import { makeAutoObservable, runInAction } from "mobx";
import { IGetPicturesResponse, IShortPictureObj } from "../interfaces/http/response/pictureInterfaces";
import PictureService from "../services/picture-service";

export interface IQueryParamsObj {
  userId: number,
  pictureTypeId: number,
  queryString: string,
  sort: string | string[] | undefined,
  page: number,
  limit: number
};

export interface IStoredPicture extends IShortPictureObj {
  alreadyDeleted?: boolean
}

export interface IStoredPictures {
  count: number,
  rows: IStoredPicture[]
}

class PictureStore {
  pictures: IStoredPictures;
  nextPageFirstPicture: IStoredPicture | null;
  queryParams: IQueryParamsObj;
  constructor() {
    this.pictures = { count: 0, rows: [] };
    this.nextPageFirstPicture = null;
    this.queryParams = {
      userId: 0,
      pictureTypeId: 0,
      queryString: "",
      sort: undefined,
      page: 1,
      limit: 3
    }
    makeAutoObservable(this);
  }

  async getPictures() {
    try {
      const response =
        await PictureService.getPictures(
          this.queryParams.userId,
          this.queryParams.pictureTypeId,
          this.queryParams.queryString,
          this.queryParams.sort,
          this.queryParams.page,
          this.queryParams.limit);
      runInAction(() => {
        this.pictures = { count: response.data.count, rows: response.data.rows };
      });
      return;
    } catch (e: any) {
      if (e.isAxiosError) {
        alert(e.response.data.message);
      } else {
        alert(e.message);
      }
    }
  }

  async addPictureLocally(picture: IShortPictureObj) {
    this.pictures.count++;
    this.pictures.rows.unshift(picture);
    this.pictures.rows.pop();
  };
};

export default PictureStore;