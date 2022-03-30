function setFileInputCurrentImg(inputImgRef: React.RefObject<HTMLImageElement>, inputFile: File | undefined, standartImgLink: string | null) {
  if (inputFile && inputImgRef.current) {
    const fr = new FileReader();
    fr.readAsDataURL(inputFile);
    fr.addEventListener('load', () => {
      inputImgRef.current!.src = String(fr.result)
    });

    return;
  }

  if (!standartImgLink) {
    inputImgRef.current?.removeAttribute('src');
    return;
  }

  inputImgRef.current!.src = standartImgLink;
  return;
}
export default setFileInputCurrentImg;