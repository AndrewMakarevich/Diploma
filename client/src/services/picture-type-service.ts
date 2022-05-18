import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { ICreatePictureTypeResponseObj, IDeletePictureTypeResponseObj, IEditPictureTypeResponseObj, IGetPictureTypesResponseObj } from "../interfaces/http/response/picture-type-interfaces";

class PictureTypeService {
  static async getPicturesTypes(queryString?: string, sort?: string[], page?: number, limit?: number): Promise<AxiosResponse<IGetPictureTypesResponseObj>> {
    return $host.get<IGetPictureTypesResponseObj>('/api/picture-type/get-all', {
      params: {
        queryString,
        sort,
        page,
        limit
      }
    });
  };

  static async createPictureType(typeName: string): Promise<AxiosResponse<ICreatePictureTypeResponseObj>> {
    return $authHost.post<ICreatePictureTypeResponseObj>("/api/picture-type/create", { name: typeName });
  };

  static async deletePictureType(pictureTypeId: number): Promise<AxiosResponse<IDeletePictureTypeResponseObj>> {
    return $authHost.delete<IDeletePictureTypeResponseObj>(`/api/picture-type/delete/${pictureTypeId}`);
  };

  static async editPictureType(pictureTypeId: number, typeName: string): Promise<AxiosResponse<IEditPictureTypeResponseObj>> {
    return $authHost.put<IEditPictureTypeResponseObj>(`/api/picture-type/edit`, { id: pictureTypeId, name: typeName });
  }
}

export default PictureTypeService;