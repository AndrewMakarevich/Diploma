import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { ICreatePictureResponse, IDeletePictureResponse, IEditPictureResponse, IExtendedPictureObj, IGetPicturesResponse } from "../interfaces/http/response/pictureInterfaces";

class PictureService {
  static async getPicture(id: number): Promise<AxiosResponse<IExtendedPictureObj>> {
    return $host.get<IExtendedPictureObj>(`api/picture/get/${id}`);
  };

  static async getPictures(userId?: number, pictureTypeId?: number, queryString?: string, sort?: string | string[], page?: number, limit?: number): Promise<AxiosResponse<IGetPicturesResponse>> {
    return $host.get<IGetPicturesResponse>('api/picture/get-many',
      {
        params: {
          userId: userId || '',
          pictureTypeId: pictureTypeId || '',
          queryString: queryString || '',
          sort: sort || '',
          page: page || 1,
          limit: limit || 5
        }
      });
  };

  static async createPicture(pictureInfo: FormData): Promise<AxiosResponse<ICreatePictureResponse>> {
    return $authHost.post<ICreatePictureResponse>('api/picture/create', pictureInfo);
  };

  static async editPicture(pictureId: number, pictureInfoToEdit: FormData): Promise<AxiosResponse<IEditPictureResponse>> {
    return $authHost.put<IEditPictureResponse>(`/api/picture/edit/${pictureId}`, pictureInfoToEdit);
  }

  static async deleteOwnPicture(pictureId: number): Promise<AxiosResponse<IDeletePictureResponse>> {
    return $authHost.delete<IDeletePictureResponse>(`/api/picture/delete-own/${pictureId}`);
  }

  static async deleteElsesPicture(pictureId: number): Promise<AxiosResponse<IDeletePictureResponse>> {
    return $authHost.delete<IDeletePictureResponse>(`/api/picture/delete-elses/${pictureId}`);
  }
}

export default PictureService;