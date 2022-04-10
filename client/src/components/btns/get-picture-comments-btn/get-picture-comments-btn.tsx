import React, { ComponentProps, useCallback } from "react"
import useFetching from "../../../hooks/useFetching";
import PictureCommentService from "../../../services/picture-comment-service"
import StandartButton from "../../../UI/standart-button/standart-button"

const GetPictureCommentsButton = ({ pictureId, commentId, setPictureComments, ...restProps }: ComponentProps<any>) => {
  const getAndSetPictureComments = useCallback(async () => {
    await PictureCommentService.getPictureComments(pictureId, commentId).then(({ data }) => setPictureComments(data))
  }, [pictureId, commentId]);

  const { executeCallback, isLoading } = useFetching(getAndSetPictureComments)
  return (
    <StandartButton onClick={() => {
      executeCallback();
    }}
      disabled={isLoading}
      {...restProps}>

    </StandartButton>
  )
};

export default GetPictureCommentsButton;