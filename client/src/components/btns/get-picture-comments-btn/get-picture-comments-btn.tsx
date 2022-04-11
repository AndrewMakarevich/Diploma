import { ComponentProps, useCallback } from "react";
import useFetching from "../../../hooks/useFetching";
import PictureCommentService from "../../../services/picture-comment-service";
import StandartButton from "../../../UI/standart-button/standart-button";

interface IGetCommentsBtnProps extends ComponentProps<"button"> {
  pictureId: number;
  commentId: number;
  setPictureComments: Function;
}

const GetPictureCommentsButton = ({
  pictureId,
  commentId,
  setPictureComments,
  onClick,
  ...restProps
}: IGetCommentsBtnProps) => {
  const getAndSetPictureComments = useCallback(async () => {
    await PictureCommentService.getPictureComments(pictureId, commentId).then(
      ({ data }) => setPictureComments(data)
    );
  }, [pictureId, commentId]);

  const { executeCallback, isLoading } = useFetching(getAndSetPictureComments);
  return (
    <StandartButton
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
        executeCallback();
      }}
      disabled={isLoading}
      {...restProps}
    ></StandartButton>
  );
};

export default GetPictureCommentsButton;
