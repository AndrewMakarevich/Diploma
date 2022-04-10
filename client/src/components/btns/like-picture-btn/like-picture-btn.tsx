import { AxiosResponse } from "axios";
import { ComponentProps, useEffect } from "react";
import useFetching from "../../../hooks/useFetching";
import { IPictureLikeResponseObj } from "../../../interfaces/http/response/pictureLikeInterfaces";
import PictureLikeService from "../../../services/picture-like-service";
import LikeButton from "../../../UI/like-button/like-button";

interface ILikePictureBtnProps {
  pictureId:number;
  actualizePictureLikes:Function;
}

const LikePictureBtn = ({pictureId,actualizePictureLikes, ...restProps}:ComponentProps<any>) =>{
  const {executeCallback: interractWithPicture, isLoading, response} = useFetching<AxiosResponse<IPictureLikeResponseObj>>(()=>PictureLikeService.likePicture(pictureId));

  // useEffect(()=>{
  //   if(response?.data){
  //     alert(response.data.message)
  //   }
  // }, [response]);

  return(
      <LikeButton 
      disabled={isLoading}
      onClick={async(e:React.ChangeEvent<any>)=>{
      await interractWithPicture(); 
      await actualizePictureLikes()   
  }}
  {...restProps}>

  </LikeButton>
  )

};

export default LikePictureBtn;