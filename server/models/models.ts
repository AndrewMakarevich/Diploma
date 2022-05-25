import { DataTypes } from 'sequelize';
import ApiError from '../apiError/apiError';
import sequelize from '../db';
import { ICommentInstance, IResetPasswordBundleInstance, IRoleInstance, IUserInstance, IUserTokenInstance } from '../interfaces/modelInterfaces';
import { IPictureInfoInstance, IPictureInstance } from '../interfaces/pictureInterfaces';
import { IPicturesTagsInstance, IPictureTagInstance } from '../interfaces/tagInterfaces';

const User = sequelize.define<IUserInstance>('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nickname: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      checkNickname(nickname: string) {
        if (!/^[a-zA-Zа-яА-ЯёЁ0-9!@$*_-]{2,25}$/.test(nickname)) {
          throw Error("Nickname doesn't match the specified pattern, symbols a-zA-Zа-яА-ЯёЁ0-9!@$*_- available, with length range from 2 to 25 symbols");
        }
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      checkEmail(email: string) {
        const emailParts = email.split("@");

        if (emailParts.length === 1 || emailParts.length > 2) {
          throw Error("@ symbol in email is required")
        };

        const recipientName = emailParts[0];
        const domainName = emailParts[1];

        if (!/^[a-zA-Z0-9!#$%&'*+-/=?^_`{}|]{1,64}$/.test(recipientName)) {
          throw Error("Incorrect email recipient name");
        };

        if (domainName.length > 253) {
          throw Error("Domain name is too long, maximum length is 253 symbols");
        };

        const subDomains = domainName.split(".");

        if (subDomains.length < 2) {
          throw Error("Incorrect sub domains recieved");
        }

        const topLevelDomain = subDomains.splice(-1, 1)[0];

        subDomains.forEach(domain => {
          if (!/^[a-zA-Z0-9-]+$/) {
            throw Error(`Your sub domain \"${domain}\" doesnt match the specified pattern: a-zA-Z0-9 symbols available`)
          }
        });

        if (!/^[a-z]{2,14}$/.test(topLevelDomain)) {
          throw Error(`Your top level domain \"${topLevelDomain}\" doesn't match the specified pattern, a-z symbols available, with length range from 2 to 14 symbols`)
        }
        return;
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    // validate: { is: /^[a-zA-Zа-яА-ЯёЁ0-9!@№#$%^:?&*()_+-=]{8,32}$/ }
  },
  firstName: {
    type: DataTypes.STRING, validate: {
      checkNickname(nickname: string) {
        if (!/^[a-zA-Zа-яА-ЯёЁ]{2,35}$/.test(nickname)) {
          throw Error("First name doesn't match the specified pattern, symbols a-zA-Zа-яА-ЯёЁ available, with length range from 2 to 35 symbols");
        }
      }
    }
  },
  surname: {
    type: DataTypes.STRING, validate: {
      checkSurname(surname: string) {
        if (!/^[a-zA-Zа-яА-ЯёЁ]{2,35}$/.test(surname)) {
          throw Error("First name doesn't match the specified pattern, symbols a-zA-Zа-яА-ЯёЁ available, with length range from 2 to 35 symbols");
        }
      }
    }
  },
  avatar: { type: DataTypes.STRING },
  profileBackground: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  activationKey: { type: DataTypes.STRING, allowNull: false },
  isBanned: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const UserToken = sequelize.define<IUserTokenInstance>('userToken', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userIp: { type: DataTypes.STRING, allowNull: false },
  refreshToken: { type: DataTypes.TEXT }
});

const ResetPasswordBundle = sequelize.define<IResetPasswordBundleInstance>('resetPasswordBundle', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  emailApproveKey: { type: DataTypes.STRING, allowNull: false },
  newPassword: { type: DataTypes.STRING, allowNull: true }
});

const Picture = sequelize.define<IPictureInstance>('picture', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, allowNull: false },
  mainTitle: { type: DataTypes.STRING, allowNull: false, validate: { is: /^[a-zA-Z0-9\s-&!?(){}'<>,~@\"]{2,35}$/ } },
  description: { type: DataTypes.TEXT, allowNull: false, validate: { is: /^[a-zA-Z0-9\s-&!?(){}'<>,~@\":]{2,1000}$/ } }
});

const PictureInfo = sequelize.define<IPictureInfoInstance>('pictureInfo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, validate: { is: /^[a-zA-Z0-9\s-&!?(){}'<>,~@\"]{2,25}$/ } },
  description: { type: DataTypes.STRING, allowNull: false, validate: { is: /^[a-zA-Z0-9\s-&!?(){}'<>,~@\"]{2,450}$/ } }
});

const PictureType = sequelize.define('pictureType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING }
});

const PictureTag = sequelize.define<IPictureTagInstance>('pictureTag', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT, allowNull: false, validate: { is: /^[a-zA-Z0-9\s]{3,20}$/ }, unique: true }
});

const PicturesTags = sequelize.define<IPicturesTagsInstance>('picturesTags', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const PictureLike = sequelize.define('pictureLike', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Comment = sequelize.define<ICommentInstance>('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT, allowNull: true, validate: { is: /^[a-zA-Z0-9\s-&!?(){}'<>^_,~@\"]{4,250}$/ } }
});

const CommentLike = sequelize.define('commentLike', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Role = sequelize.define<IRoleInstance>('role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  // Guest permissions
  readComment: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  // User permissions
  loadPicture: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  addComment: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  addLike: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  // Admin permissions
  moderatePictureType: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  moderatePictureTag: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  changeUserRole: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  deleteOtherComment: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  deleteOtherPicture: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  blockPicture: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  blockAccount: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  // Super-admin permissions
  deleteOtherAccount: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

User.hasMany(UserToken, { onDelete: "cascade" });
UserToken.belongsTo(User);

Role.hasMany(User);
User.belongsTo(Role);

User.hasOne(ResetPasswordBundle, { onDelete: "cascade" });
ResetPasswordBundle.belongsTo(User);

User.hasMany(Comment, { onDelete: "cascade" });
Comment.belongsTo(User);

Comment.hasMany(CommentLike, { onDelete: "cascade" });
CommentLike.belongsTo(Comment);

User.hasMany(CommentLike, { onDelete: "cascade" });
CommentLike.belongsTo(User);

Comment.hasMany(Comment, { onDelete: "cascade" });
Comment.belongsTo(Comment);

User.hasMany(Picture, { onDelete: "cascade" });
Picture.belongsTo(User);

Picture.belongsToMany(PictureTag, { through: PicturesTags, as: "tags", onDelete: 'cascade' });
PictureTag.belongsToMany(Picture, { through: PicturesTags, as: "pictures", onDelete: 'cascade' });

Picture.hasMany(PictureInfo, { onDelete: "cascade" });
PictureInfo.belongsTo(Picture);

Picture.hasMany(PictureLike, { onDelete: "cascade" });
PictureLike.belongsTo(Picture);

User.hasMany(PictureLike, { onDelete: "cascade" });
PictureLike.belongsTo(User);

PictureType.hasMany(Picture);
Picture.belongsTo(PictureType);

Picture.hasMany(Comment, { onDelete: "cascade" });
Comment.belongsTo(Picture);

User.hasMany(PictureType);
PictureType.belongsTo(User);

export default {
  User,
  UserToken,
  ResetPasswordBundle,
  Picture,
  PictureInfo,
  PictureType,
  PictureTag,
  PicturesTags,
  PictureLike,
  Comment,
  CommentLike,
  Role,
}

