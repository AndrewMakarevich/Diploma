function returnPictureLink(imgName?: string | null) {
  if (imgName) {
    return process.env.REACT_APP_BACK_LINK + "/img/picture/" + imgName
  }
  return ''
};

export default returnPictureLink;