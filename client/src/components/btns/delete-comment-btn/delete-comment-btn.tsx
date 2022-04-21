import buttonStyles from "./delete-comment-btn.module.css";
import { AxiosResponse } from "axios";
import { useCallback, useEffect } from "react";
import DeleteIcon from "../../../assets/img/icons/delete-icon/delete-icon";
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

  const { executeCallback: deleteComment, isLoading: deleteCommentLoading, response: deleteCommentResponse } =
    useFetching<AxiosResponse<IDeleteCommentResponseObj>>(requestToDeleteComment);

  const actualizeCommentList = useCallback(() => {
    actualizeCommentListAfterDeleting(commentId)
  }, [actualizeCommentListAfterDeleting, commentId]);

  useEffect(() => {
    if (deleteCommentResponse) {
      alert(deleteCommentResponse.data.message);
      actualizeCommentList();
    }
  }, [deleteCommentResponse]);

  return (
    <button
      disabled={deleteCommentLoading}
      className={buttonStyles["button"]}
      onClick={async (e) => {
        e.preventDefault();

        if (window.confirm("Are you sure you want to delete this comment")) {
          await deleteComment();
        }
      }}>
      <DeleteIcon />
    </button>
  )
};

export default DeleteCommentBtn;