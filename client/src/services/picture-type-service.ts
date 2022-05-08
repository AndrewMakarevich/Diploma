import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { ICreatePictureTypeResponseObj, IDeletePictureTypeResponseObj, IEditPictureTypeResponseObj, IGetPictureTypesResponseObj } from "../interfaces/http/response/picture-type-interfaces";

class PictureTypeService {
  static async getPicturesTypes(queryString?: string, page?: number, limit?: number): Promise<AxiosResponse<IGetPictureTypesResponseObj>> {
    const response = await $host.get<IGetPictureTypesResponseObj>('/api/picture-type/get-all', {
      params: {
        queryString,
        page,
        limit
      }
    });

    return response;
  };

  static async createPictureType(typeName: string): Promise<AxiosResponse<ICreatePictureTypeResponseObj>> {
    const response = await $authHost.post<ICreatePictureTypeResponseObj>("/api/picture-type/create", { name: typeName });

    return response;
  };

  static async deletePictureType(pictureTypeId: number): Promise<AxiosResponse<IDeletePictureTypeResponseObj>> {
    const response = await $authHost.delete<IDeletePictureTypeResponseObj>(`/api/picture-type/delete/${pictureTypeId}`);

    return response;
  };

  static async editPictureType(pictureTypeId: number, typeName: string): Promise<AxiosResponse<IEditPictureTypeResponseObj>> {
    const response = await $authHost.put<IEditPictureTypeResponseObj>(`/api/picture-type/edit`, { id: pictureTypeId, name: typeName });

    return response;
  }
}

export default PictureTypeService;