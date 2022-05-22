import { makeAutoObservable, runInAction } from "mobx";
import { IShortPictureObj } from "../interfaces/http/response/pictureInterfaces";
import { IGetPicturesCursorInterface } from "../interfaces/services/pictureSericeInterfaces";
import PictureService from "../services/picture-service";

export interface IQueryParamsObj {
  [key: string]: any,
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
  locallyAddedPicturesIds: number[];
  picturesLoading: boolean;
  queryParams: IQueryParamsObj;
  constructor() {
    this.pictures = { count: -1, rows: [] };
    this.locallyAddedPicturesIds = [];
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
      limit: 5
    }
    makeAutoObservable(this);
  }

  async getPictures(rewrite = false) {
    try {
      if (this.pictures.count <= this.pictures.rows.length && !rewrite && this.pictures.count !== -1) {
        return;
      }

      if (rewrite) {
        this.clearPictureList();
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
        const filteredForDuplicatesArr = data.rows.filter(picture => !this.locallyAddedPicturesIds.some(id => id === picture.id));

        this.pictures = { count: data.count, rows: rewrite ? data.rows : [...this.pictures.rows, ...filteredForDuplicatesArr] };

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

  addPictureLocally(picture: IShortPictureObj) {
    this.pictures.count++;
    this.pictures.rows.push(picture);
    this.locallyAddedPicturesIds.push(picture.id);
  };

  deletePictureLocally(pictureToDeleteId: number) {
    this.pictures.count--;
    this.pictures.rows = this.pictures.rows.filter(picture => picture.id !== pictureToDeleteId)
  };

  clearPictureList() {
    this.locallyAddedPicturesIds = [];
    this.queryParams.userId = 0;
    this.queryParams.cursor.value = 0;
    this.queryParams.cursor.id = 0;
    this.pictures = { count: -1, rows: [] }
  }
};

export default PictureStore;