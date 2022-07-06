
import models from "../models/models";
import { CreationAttributes, WhereOptions } from "sequelize";
class RoleService {
  static async findRole(roleId: number) {
    const role = await models.Role.findOne({ where: { id: roleId } });
    return role;
  }
  static async checkBaseRoles() {
    async function createRole(roleName: string, permissionObj: WhereOptions<any> | CreationAttributes<any>) {
      const userRole = await models.Role.findOne({
        where: {
          name: roleName
        }
      });
      if (userRole) {
        return userRole.update(permissionObj);
      }
      await models.Role.create({
        name: roleName,
        ...permissionObj as CreationAttributes<any>,
      });
    }
    const userPermissionsObj = {
      readComment: true,
      loadPicture: true,
      addComment: true,
      addLike: true
    };
    const adminPermissionsObj = {
      ...userPermissionsObj,
      moderatePictureType: true,
      moderatePictureTag: true,
      moderateNotifications: true,
      deleteOtherComment: true,
      deleteOtherPicture: true,
      blockPicture: true,
      blockAccount: true,
      changeUserRole: true
    };
    const superAdminPermissionsObj = {
      ...adminPermissionsObj,
      deleteOtherAccount: true
    }
    createRole('USER', userPermissionsObj);
    createRole('ADMIN', adminPermissionsObj);
    createRole('SUPER_ADMIN', superAdminPermissionsObj);
  }
};
export default RoleService;