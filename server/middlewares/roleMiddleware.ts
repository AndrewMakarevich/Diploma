import { NextFunction, Request, Response } from "express"
import ApiError from "../apiError/apiError"
import { IUserDto } from "../dtos/userDto"
import { rolePermissions } from "../enums/roles"
import RoleService from "../services/roleService"
export default (permissionToCheck: rolePermissions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = (req as any).user as IUserDto;
      const userRole = await RoleService.findRole(userData.roleId);

      if (!userRole || !userRole[permissionToCheck]) {
        return next(ApiError.forbidden('You have no access to this function due to your permissions'));
      }
      next();
    } catch (e) {
      throw ApiError.forbidden((e as Error).message);
    }
  }
}