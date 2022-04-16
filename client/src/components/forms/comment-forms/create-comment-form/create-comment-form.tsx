import { useCallback, useEffect, useState } from "react";
import formStyles from "./create-comment-form.module.css";
import useFetching from "../../../../hooks/useFetching";
import PictureCommentService from "../../../../services/picture-comment-service";
import CommentValidator from "../../../../validator/comment-validator";
import { ICreateCommentResponseObj } from "../../../../interfaces/http/response/pictureCommentInterfaces";
import { AxiosResponse } from "axios";

interface ICreateCommentFormProps {
  pictureId: number,
  commentId?: number,
  actualizeCommentList: Function
}

const CreateCommentForm = ({ pictureId, commentId, actualizeCommentList }: ICreateCommentFormProps) => {
  const [commentText, setCommentText] = useState("");

  const sendRequestToAddComment = useCallback(async () => {
    CommentValidator.validateCommentText(commentText, true);
    const response = await PictureCommentService.addComment(pictureId, commentText, commentId);
    alert(response.data.message);
    return response;
  }, [commentText, pictureId, commentId]);

  const {
    executeCallback: createComment,
    isLoading: createCommentLoading,
    response: createCommentResponse } = useFetching<AxiosResponse<ICreateCommentResponseObj>>(sendRequestToAddComment);

  useEffect(() => {
    if (createCommentResponse) {
      console.log(createCommentResponse.data.comment);
      actualizeCommentList(createCommentResponse.data.comment);
    }
  }, [createCommentResponse]);

  return (
    <form className={formStyles["create-comment-form"]}>
      <textarea className={formStyles["textarea"]} onChange={(e) => setCommentText(e.target.value)} />

      <button
        className={formStyles["create-comment-btn"]}
        disabled={createCommentLoading || !commentText}
        onClick={async (e) => {
          await createComment();
        }}>
        Send
      </button>
    </form>
  )
};

export default CreateCommentForm;