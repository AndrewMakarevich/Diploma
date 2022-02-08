
import models from "../models/models";
import { WhereOptions } from "sequelize";
class RoleService {
  static async checkBaseRoles() {
    async function createRole(roleName: string, permissionObj: WhereOptions<any>) {
      const [userPermissions] = await models.Permission.findOrCreate({ where: permissionObj });
      await models.Role.findOrCreate({
        where: {
          name: roleName,
          permissionId: userPermissions.id
        }
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
      deleteOtherComment: true,
      deleteOtherPicture: true,
      blockPicture: true,
      blockAccount: true
    };
    const superAdminPermissionsObj = {
      ...adminPermissionsObj,
      deleteOtherAccount: true
    }
    createRole('USER', userPermissionsObj);
    createRole('ADMIN', adminPermissionsObj);
    createRole('SUPERADMIN', superAdminPermissionsObj);
  }
};
export default RoleService;