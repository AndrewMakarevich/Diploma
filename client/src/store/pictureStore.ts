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
  rows: IStoredPicture[]
}

class PictureStore {
  pictures: IStoredPictures;
  allPicturesRecieved: boolean;
  locallyAddedPicturesIds: number[];
  picturesLoading: boolean;
  queryParams: IQueryParamsObj;
  constructor() {
    this.pictures = { rows: [] };
    this.allPicturesRecieved = false;
    this.locallyAddedPicturesIds = [];
    this.picturesLoading = false;
    this.queryParams = {
      userId: 0,
      pictureTypeId: 0,
      queryString: "",
      cursor: {
        key: "likesAmount",
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
      if (rewrite) {
        this.clearPictures();
        this.clearCursor();
      }

      if (this.allPicturesRecieved) {
        return;
      }

      const { cursor, limit, pictureTypeId, userId, queryString } = this.queryParams;
      runInAction(() => this.picturesLoading = true);

      const { data } = await PictureService.getPictures(
        cursor,
        userId,
        pictureTypeId,
        queryString,
        limit);

      const filteredForDuplicatesArr = data.rows.filter(picture => !this.locallyAddedPicturesIds.some(id => id === picture.id));
      runInAction(() => {
        this.pictures = { rows: rewrite ? data.rows : [...this.pictures.rows, ...filteredForDuplicatesArr] };
      });

      if (data.rows.length) {
        cursor.value = data.rows[data.rows.length - 1][cursor.key]
        cursor.id = data.rows[data.rows.length - 1].id
      } else {
        runInAction(() => {
          this.allPicturesRecieved = true;
          setTimeout(() => { this.allPicturesRecieved = false }, 1000 * 60)
        })
      }
      return data;
    } catch (e: any) {
      if (e.isAxiosError) {
        alert(e.response.data.message);
      } else {
        alert(e.message);
      }
    } finally {
      runInAction(() => {
        this.picturesLoading = false;
      })
    }
  }

  addPictureLocally(picture: IShortPictureObj) {
    this.pictures.rows.push(picture);
    this.locallyAddedPicturesIds.push(picture.id);
  };

  deletePictureLocally(pictureToDeleteId: number) {
    this.pictures.rows = this.pictures.rows.filter(picture => picture.id !== pictureToDeleteId)
  };

  clearPictures() {
    this.locallyAddedPicturesIds = [];
    this.allPicturesRecieved = false;
    this.pictures = { rows: [] }
  }

  clearCursor() {
    this.queryParams.cursor.value = 0;
    this.queryParams.cursor.id = 0;
  }

  clearPictureStore() {
    this.clearPictures();
    this.clearCursor();
    this.queryParams.userId = 0;
  }
};

export default PictureStore;