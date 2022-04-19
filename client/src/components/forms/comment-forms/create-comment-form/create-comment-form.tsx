import { useCallback, useEffect, useState } from "react";
import formStyles from "./create-comment-form.module.css";
import useFetching from "../../../../hooks/useFetching";
import PictureCommentService from "../../../../services/picture-comment-service";
import CommentValidator from "../../../../validator/comment-validator";
import { ICreateCommentResponseObj, IGetCommentByIdResponseObj } from "../../../../interfaces/http/response/pictureCommentInterfaces";
import { AxiosResponse } from "axios";

interface ICreateCommentFormProps {
  pictureId: string | number,
  commentId?: string | number,
  actualizeCommentList: (comment: IGetCommentByIdResponseObj) => void,
  setAddCommentFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCommentForm = ({ pictureId, commentId, actualizeCommentList, setAddCommentFormOpen }: ICreateCommentFormProps) => {
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
    response: createCommentResponse } = useFetching<AxiosResponse<ICreateCommentResponseObj>>(sendRequestToAddComment);

  useEffect(() => {
    if (createCommentResponse) {
      actualizeCommentList(createCommentResponse.data.comment);
      setAddCommentFormOpen(false);
    }
  }, [createCommentResponse, setAddCommentFormOpen, actualizeCommentList]);

  return (
    <form className={`${formStyles["create-comment-form"]} ${commentId ? formStyles["nested-create-comment-form"] : ""}`}>
      <textarea
        className={`${formStyles["textarea"]} ${commentId ? formStyles["nested-textarea"] : ""}`}
        onChange={(e) => setCommentText(e.target.value)} />

      <button
        className={`${formStyles["create-comment-btn"]} ${commentId ? formStyles["nested-create-comment-btn"] : ""}`}
        disabled={createCommentLoading || !commentText}
        onClick={async (e) => {
          e.preventDefault();
          await createComment();
        }}>
        Send
      </button>
    </form>
  )
};

export default CreateCommentForm;