import UserCleaner from "./userCleaner";
export default () => {
  UserCleaner.checkForOutdateUsersAccounts();
  UserCleaner.checkForOutdateRefreshTokens();
};