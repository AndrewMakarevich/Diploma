import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { IPermissionsInstance, IRoleInstance, IUserInstance, IUserTokenInstance } from '../interfaces/modelInterfaces';

const User = sequelize.define<IUserInstance>('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nickname: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING },
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
const Picture = sequelize.define('picture', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    img: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT }
});
const PictureInfo = sequelize.define('pictureInfo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
});
const PictureType = sequelize.define('pictureType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING }
});
const PictureTag = sequelize.define('pictureTag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false }
});
const PicturesTags = sequelize.define('picturesTags', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
const PictureLike = sequelize.define('pictureLike', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})
const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: true }
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
    changeUserRole: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deleteOtherComment: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deleteOtherPicture: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    blockPicture: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    blockAccount: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    // Super-admin permissions
    deleteOtherAccount: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

User.hasMany(UserToken);
UserToken.belongsTo(User);

Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Comment);
Comment.belongsTo(User);

Comment.hasMany(CommentLike);
CommentLike.belongsTo(Comment);

User.hasMany(CommentLike);
CommentLike.belongsTo(User);

Comment.hasMany(Comment);
Comment.belongsTo(Comment);

User.hasMany(Picture);
Picture.belongsTo(User);

Picture.belongsToMany(PictureTag, { through: PicturesTags, as: "tags" });
PictureTag.belongsToMany(PictureTag, { through: PicturesTags, as: "pictures" });

Picture.hasMany(PictureInfo);
PictureInfo.belongsTo(Picture);

Picture.hasMany(PictureLike);
PictureLike.belongsTo(Picture);

User.hasMany(PictureLike);
PictureLike.belongsTo(User);

PictureType.hasMany(Picture);
Picture.belongsTo(PictureType);

Picture.hasMany(Comment);
Comment.belongsTo(Picture);

User.hasMany(PictureType);
PictureType.belongsTo(User);

export default {
    User,
    UserToken,
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

