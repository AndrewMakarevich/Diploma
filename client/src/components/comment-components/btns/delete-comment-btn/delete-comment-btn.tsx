import buttonStyles from "./delete-comment-btn.module.css";
import React, { useCallback, useEffect } from "react";
import DeleteIcon from "../../../../assets/img/icons/delete-icon/delete-icon";
import useFetching from "../../../../hooks/useFetching";
import PictureCommentService from "../../../../services/picture-comment-service";

interface IDeleteCommentBtnProps {
  commentId: string | number;
  actualizeCommentListAfterDeleting: Function
}

const DeleteCommentBtn = ({ commentId, actualizeCommentListAfterDeleting }: IDeleteCommentBtnProps) => {
  const requestToDeleteComment = useCallback(async () => {
    if (window.confirm("Are you sure you want to delete this comment")) {
      const response = await PictureCommentService.deleteComment(commentId);
      alert(response.data.message);
      return response;
    }
  }, [commentId]);

  const { executeCallback: deleteComment, isLoading: deleteCommentLoading, response: deleteCommentResponse } =
    useFetching(requestToDeleteComment);

  useEffect(() => {
    if (deleteCommentResponse) {
      actualizeCommentListAfterDeleting(commentId);
    }
  }, [deleteCommentResponse, commentId]);

  return (
    <button
      type="button"
      disabled={deleteCommentLoading}
      className={buttonStyles["button"]}
      onClick={deleteComment}>
      <DeleteIcon />
    </button>
  )
};

export default DeleteCommentBtn;