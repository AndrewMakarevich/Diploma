import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { ICreatePictureResponse, IDeletePictureResponse, IEditPictureResponse, IExtendedPictureObj, IGetPicturesResponse } from "../interfaces/http/response/pictureInterfaces";

class PictureService {
  static async getPicture(id: number): Promise<AxiosResponse<IExtendedPictureObj>> {
    const response = await $host.get<IExtendedPictureObj>(`api/picture/get/${id}`);

    return response;
  };

  static async getPictures(userId?: number, pictureTypeId?: number, queryString?: string, sort?: string | string[], page?: number, limit?: number): Promise<AxiosResponse<IGetPicturesResponse>> {
    const response =
      await $host.get<IGetPicturesResponse>('api/picture/get-many',
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

    return response;
  };

  static async createPicture(pictureInfo: FormData): Promise<AxiosResponse<ICreatePictureResponse>> {
    const response = await $authHost.post<ICreatePictureResponse>('api/picture/create', pictureInfo);

    return response;
  };

  static async editPicture(pictureId: number, pictureInfoToEdit: FormData): Promise<AxiosResponse<IEditPictureResponse>> {
    const response = await $authHost.put<IEditPictureResponse>(`/api/picture/edit/${pictureId}`, pictureInfoToEdit);

    return response;
  }

  static async deleteOwnPicture(pictureId: number): Promise<AxiosResponse<IDeletePictureResponse>> {
    const response = await $authHost.delete<IDeletePictureResponse>(`/delete-own/${pictureId}`);

    return response;
  }

  static async deleteElsesPicture(pictureId: number): Promise<AxiosResponse<IDeletePictureResponse>> {
    const response = await $authHost.delete<IDeletePictureResponse>(`/delete-elses/${pictureId}`);

    return response;
  }
}

export default PictureService;