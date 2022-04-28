function setFileInputCurrentImg(inputImgRef?: React.RefObject<HTMLImageElement | null>, inputFile?: File | null, standartImgLink?: string | null) {
  if (inputFile && inputImgRef?.current) {
    const fr = new FileReader();
    fr.readAsDataURL(inputFile);
    fr.addEventListener('load', () => {
      inputImgRef.current!.src = String(fr.result)
    });

    return;
  }

  if (!standartImgLink) {
    inputImgRef?.current?.removeAttribute('src');
    return;
  }

  if (inputImgRef?.current) {
    inputImgRef.current.src = standartImgLink;
  }

  return;
}
export default setFileInputCurrentImg;