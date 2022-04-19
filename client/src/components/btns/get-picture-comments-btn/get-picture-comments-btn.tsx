import { AxiosResponse } from "axios";
import { ComponentProps, useCallback, useEffect } from "react";
import useFetching from "../../../hooks/useFetching";
import { IGetCommentByIdResponseObj, IGetCommentsResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";
import PictureCommentService from "../../../services/picture-comment-service";
import StandartButton from "../../../UI/standart-button/standart-button";

interface IGetPictureCommentsBtnProps extends ComponentProps<"button"> {
  pictureId: string | number;
  commentId: string | number;
  page: string | number;
  limit: string | number;
  setPage: (page: number) => void;
  pictureComments: IGetCommentsResponseObj,
  setPictureComments: React.Dispatch<React.SetStateAction<IGetCommentsResponseObj>>;
}

const GetPictureCommentsButton = ({
  pictureId,
  commentId,
  page,
  setPage,
  limit,
  pictureComments,
  setPictureComments,
  onClick,
  ...restProps
}: IGetPictureCommentsBtnProps) => {
  const getAndSetPictureComments = useCallback(async () => {
    const response = await PictureCommentService.getPictureComments(pictureId, commentId, page, limit);

    return response;
  }, [pictureId, commentId, page, limit]);

  const { executeCallback, isLoading, response } = useFetching<AxiosResponse<IGetCommentsResponseObj>>(getAndSetPictureComments);

  //If a list of comments returned from the server, set them to the state
  useEffect(() => {
    if (response) {
      setPictureComments({ count: response.data.count, rows: [...pictureComments.rows, ...response.data.rows] });
    }
  }, [response, setPictureComments]);

  return (
    <StandartButton
      onClick={async (e) => {
        if (onClick) {
          await onClick(e);
        }
        // Getting comments from the server
        await executeCallback();
        setPage(Number(page) + 1)
      }}
      disabled={isLoading}
      {...restProps}
    ></StandartButton>
  );
};

export default GetPictureCommentsButton;
