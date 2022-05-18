import { useCallback, useContext, useEffect, useState } from "react";
import formStyles from "./create-comment-form.module.css";
import useFetching from "../../../../hooks/useFetching";
import PictureCommentService from "../../../../services/picture-comment-service";
import CommentValidator from "../../../../validator/comment-validator";
import { IGetCommentByIdResponseObj } from "../../../../interfaces/http/response/pictureCommentInterfaces";
import { Context } from "../../../..";

interface ICreateCommentFormProps {
  pictureId: number,
  commentId?: number | null,
  actualizeCommentList: (comment: IGetCommentByIdResponseObj) => void,
  setAddCommentFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCommentForm = ({ pictureId, commentId = null, actualizeCommentList, setAddCommentFormOpen }: ICreateCommentFormProps) => {
  const { userStore } = useContext(Context);
  const [commentText, setCommentText] = useState("");

  const sendRequestToAddComment = useCallback(async () => {
    CommentValidator.validateCommentText(commentText, true);
    const response = await PictureCommentService.addComment(pictureId, commentText, commentId);
    alert(response.data.message);
    ;
    return response;
  }, [commentText, pictureId, commentId]);

  const {
    executeCallback: createComment,
    isLoading: createCommentLoading,
    response: createCommentResponse } = useFetching(sendRequestToAddComment);

  const onCreateComment = async () => {
    if (!userStore.isAuth) {
      alert("Authorize to have an ability to leave comments")
      return;
    }
    createComment();
  }

  useEffect(() => {
    if (createCommentResponse) {
      const preprepairedCommentObject: IGetCommentByIdResponseObj = {
        ...createCommentResponse.data.comment,
        user: {
          avatar: userStore.userData.avatar,
          nickname: userStore.userData.nickname
        },
        childCommentsAmount: 0,
        commentLikes: [],

      }
      actualizeCommentList(preprepairedCommentObject);
      setAddCommentFormOpen(false);
    }
  }, [createCommentResponse, setAddCommentFormOpen, actualizeCommentList, userStore]);

  return (
    <form className={`${formStyles["create-comment-form"]} ${commentId ? formStyles["nested-create-comment-form"] : ""}`}>
      <textarea
        className={`${formStyles["textarea"]} ${commentId ? formStyles["nested-textarea"] : ""}`}
        onChange={(e) => setCommentText(e.target.value)} />

      <button
        type="button"
        className={`${formStyles["create-comment-btn"]} ${commentId ? formStyles["nested-create-comment-btn"] : ""}`}
        disabled={createCommentLoading || !commentText}
        onClick={onCreateComment}>
        Send
      </button>
    </form>
  )
};

export default CreateCommentForm;