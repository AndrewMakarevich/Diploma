import UserCleaner from "./userCleaner";
export default () => {
  UserCleaner.checkUnlinkedAvatars();
  UserCleaner.checkForOutdateUsersAccounts();
  UserCleaner.checkForOutdateRefreshTokens();
};