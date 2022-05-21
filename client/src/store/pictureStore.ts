import { makeAutoObservable, runInAction } from "mobx";
import { IShortPictureObj } from "../interfaces/http/response/pictureInterfaces";
import { IGetPicturesCursorInterface } from "../interfaces/services/pictureSericeInterfaces";
import PictureService from "../services/picture-service";

export interface IQueryParamsObj {
  userId: number,
  pictureTypeId: number,
  queryString: string,
  cursor: IGetPicturesCursorInterface
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
  picturesLoading: boolean;
  queryParams: IQueryParamsObj;
  constructor() {
    this.pictures = { count: -1, rows: [] };
    this.nextPageFirstPicture = null;
    this.picturesLoading = false;
    this.queryParams = {
      userId: 0,
      pictureTypeId: 0,
      queryString: "",
      cursor: {
        key: "createdAt",
        id: 0,
        value: 0,
        order: "DESC"
      },
      limit: 2
    }
    makeAutoObservable(this);
  }

  async getPictures(rewrite = false) {
    try {
      if (this.pictures.count === this.pictures.rows.length && !rewrite) {
        return;
      }



      const { cursor, limit, pictureTypeId, userId, queryString } = this.queryParams;
      runInAction(() => this.picturesLoading = true);
      const { data } =
        await PictureService.getPictures(
          cursor,
          userId,
          pictureTypeId,
          queryString,
          limit);
      runInAction(() => {
        this.pictures = { count: data.count, rows: rewrite ? data.rows : [...this.pictures.rows, ...data.rows] };

        if (data.count) {
          cursor.value = data.rows[data.rows.length - 1][cursor.key]
          cursor.id = data.rows[data.rows.length - 1].id
        }
      });
      return data;
    } catch (e: any) {
      if (e.isAxiosError) {
        alert(e.response.data.message);
      } else {
        alert(e.message);
      }
    } finally {
      this.picturesLoading = false;
    }
  }

  async addPictureLocally(picture: IShortPictureObj) {
    this.pictures.count++;

    if (this.pictures.rows.length >= this.queryParams.limit) {
      this.pictures.rows.pop();
    }
    this.pictures.rows.unshift(picture);
  };

  clearPictureList() {
    this.queryParams.userId = 0;
    this.queryParams.cursor.value = 0;
    this.queryParams.cursor.id = 0;
    this.pictures = { count: -1, rows: [] }
  }
};

export default PictureStore;