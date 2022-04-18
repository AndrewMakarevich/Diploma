import { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect } from "react";
import useFetching from "../../../hooks/useFetching";
import { IDeleteCommentResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";
import PictureCommentService from "../../../services/picture-comment-service";

interface IDeleteCommentBtnProps {
  commentId: string | number;
  actualizeCommentListAfterDeleting: Function
}

const DeleteCommentBtn = ({ commentId, actualizeCommentListAfterDeleting }: IDeleteCommentBtnProps) => {
  const requestToDeleteComment = useCallback(async () => {
    const response = await PictureCommentService.deleteComment(commentId);

    return response;
  }, [commentId]);

  const { executeCallback: deleteComment, isLoading: deleteCommentButton, response: deleteCommentResponse } =
    useFetching<AxiosResponse<IDeleteCommentResponseObj>>(requestToDeleteComment);

  const actualizeCommentList = useCallback(() => {
    actualizeCommentListAfterDeleting(commentId)
  }, [actualizeCommentListAfterDeleting, commentId]);

  useEffect(() => {
    console.log('DELEted comment 1')
    if (deleteCommentResponse) {
      console.log('DELEted comment 2')
      alert(deleteCommentResponse.data.message);
      actualizeCommentList();
    }
  }, [deleteCommentResponse]);

  return (
    <button
      disabled={deleteCommentButton}
      onClick={async (e) => {
        e.preventDefault();
        await deleteComment();
      }}>
      Delete comment
    </button>
  )
};

export default DeleteCommentBtn;