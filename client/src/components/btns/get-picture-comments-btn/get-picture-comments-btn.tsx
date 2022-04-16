import { AxiosResponse } from "axios";
import { ComponentProps, useCallback, useEffect } from "react";
import useFetching from "../../../hooks/useFetching";
import { IGetCommentsResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";
import PictureCommentService from "../../../services/picture-comment-service";
import StandartButton from "../../../UI/standart-button/standart-button";

interface IGetPictureCommentsBtnProps extends ComponentProps<"button"> {
  pictureId: number;
  commentId: number;
  setPictureComments: React.Dispatch<React.SetStateAction<IGetCommentsResponseObj[]>>;
}

const GetPictureCommentsButton = ({
  pictureId,
  commentId,
  setPictureComments,
  onClick,
  ...restProps
}: IGetPictureCommentsBtnProps) => {
  const getAndSetPictureComments = useCallback(async () => {
    const response = await PictureCommentService.getPictureComments(pictureId, commentId);

    return response;
  }, [pictureId, commentId]);

  const { executeCallback, isLoading, response } = useFetching<AxiosResponse<IGetCommentsResponseObj[]>>(getAndSetPictureComments);

  //If a list of comments returned from the server, set them to the state
  useEffect(() => {
    if (response) {
      setPictureComments(response.data);
    }
  }, [response, setPictureComments]);

  return (
    <StandartButton
      onClick={async (e) => {
        if (onClick) {
          await onClick(e);
        }
        // Getting comment from the server
        await executeCallback();
      }}
      disabled={isLoading}
      {...restProps}
    ></StandartButton>
  );
};

export default GetPictureCommentsButton;
