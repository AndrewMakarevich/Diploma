import { makeAutoObservable, runInAction } from "mobx";
import { IGetPicturesResponse } from "../interfaces/http/response/pictureInterfaces";
import PictureService from "../services/picture-service";

export interface IQueryParamsObj {
  userId: number,
  queryString: string,
  sort: string | string[] | undefined,
  page: number,
  limit: number
};

class PictureStore {
  pictures: IGetPicturesResponse;
  queryParams: IQueryParamsObj;
  constructor() {
    this.pictures = { count: 0, rows: [] };
    this.queryParams = {
      userId: 0,
      queryString: "",
      sort: undefined,
      page: 1,
      limit: 1
    }
    makeAutoObservable(this);
  }

  async getPictures() {
    try {
      if (this.queryParams.queryString === "@" || this.queryParams.queryString === "#") {
        return;
      }
      const response =
        await PictureService.getPictures(
          this.queryParams.userId,
          this.queryParams.queryString,
          this.queryParams.sort,
          this.queryParams.page,
          this.queryParams.limit);
      runInAction(() => {
        this.pictures = response.data;
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
};

export default PictureStore;