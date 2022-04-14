function returnUserAvatar(imgName: string) {
  if (imgName) {
    return process.env.REACT_APP_BACK_LINK + "/img/avatar/" + imgName;
  }

  return process.env.REACT_APP_BACK_LINK + "/img/avatar/default.png";
}
export default returnUserAvatar;