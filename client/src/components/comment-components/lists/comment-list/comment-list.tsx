import { Fragment, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../../../..";
import { IGetCommentByIdResponseObj, IGetCommentsResponseObj } from "../../../../interfaces/http/response/pictureCommentInterfaces";
import StandartButton from "../../../../UI/standart-button/standart-button";
import CreateCommentForm from "../../../forms/comment-forms/create-comment-form/create-comment-form";
import CommentItem from "./comment-item/comment-item";
import { ICommentListProps } from "./comment-list-interfaces";
import listStyles from "./comment-list.module.css";
import useFetching from "../../../../hooks/useFetching";
import PictureCommentService from "../../../../services/picture-comment-service";
import { AxiosResponse } from "axios";

const PictureCommentList = ({ pictureId, pictureAuthorId, commentId = null, commentsAmount = 0 }: ICommentListProps) => {
  const { userStore } = useContext(Context);

  const [commentsAmountValue, setCommentsAmountValue] = useState<number>(0);
  const [commentsListIsOpen, setCommentsListIsOpen] = useState(true);
  const [addCommentFormOpen, setAddCommentFormOpen] = useState(false);
  const [comments, setComments] = useState<IGetCommentsResponseObj>({ count: 0, rows: [] });
  const [commentsPaginationParams, setCommentsPaginationParams] = useState({ page: 1, limit: 1 });

  const sendRequestToGetComments = useCallback(
    async (page: number = commentsPaginationParams.page, limit: number = commentsPaginationParams.limit) => {
      return PictureCommentService.getPictureComments(pictureId, commentId, page, limit);
    }, [pictureId, commentId, commentsPaginationParams]
  )

  const { executeCallback: getComments, isLoading: commentsLoading } =
    useFetching<AxiosResponse<IGetCommentsResponseObj>, (page?: number, limit?: number) => Promise<AxiosResponse<IGetCommentsResponseObj>>>(sendRequestToGetComments);

  const onGetComments = useCallback(async () => {
    const response = await getComments();
    setComments({ rows: [...comments.rows, ...response.data.rows], count: response.data.count });
    setCommentsPaginationParams({ ...commentsPaginationParams, page: commentsPaginationParams.page + 1 })
  }, [getComments, comments, commentsPaginationParams]);

  const actualizeListAfterItemDelete = useCallback(async (commentId: number) => {
    if (comments.rows.length === comments.count) {
      setComments({ count: comments.count - 1, rows: comments.rows.filter(comment => comment.id !== commentId) });
      return;
    }
    if (comments.rows.length) {
      const response = await getComments(1, comments.rows.length);
      setComments(response.data);
      // setCommentsAmountValue(commentsAmountValue ? Number(commentsAmountValue) - 1 : 0);
    }
  }, [getComments, comments]);

  const actualizeListAfterItemCreation = useCallback((comment: IGetCommentByIdResponseObj) => {
    if (comments.rows.length) {
      setComments({ ...comments, rows: [{ ...comment, commentLikes: [] }, ...comments.rows], count: +comments.count + 1 });
      setCommentsAmountValue(commentsAmountValue ? Number(commentsAmountValue) + 1 : 1);
    }
  }, [comments, commentsAmountValue]);

  const amountAndRecievedCommentsDiff = useMemo(() => {
    return +commentsAmountValue - comments.rows.length;
  }, [comments, commentsAmountValue]);

  const getShowCommentsBtnText = (amountAndRecievedCommentsDiff < commentsPaginationParams.limit ?
    amountAndRecievedCommentsDiff
    :
    commentsPaginationParams.limit)
    +
    ` comments ${amountAndRecievedCommentsDiff ? `(${amountAndRecievedCommentsDiff} remaining)` : ""}`

  useEffect(() => {
    setCommentsAmountValue(+commentsAmount);
  }, [commentsAmount]);

  return (
    <div className={`${listStyles["comment-list__wrapper"]} ${commentId ? listStyles["nested"] : ""} ${commentsLoading ? listStyles["loading"] : ""}`}>
      {
        addCommentFormOpen && userStore.userData.role?.addComment ?
          <CreateCommentForm
            pictureId={pictureId}
            commentId={commentId}
            actualizeCommentList={actualizeListAfterItemCreation}
            setAddCommentFormOpen={setAddCommentFormOpen} />
          :
          null
      }
      <div className={listStyles["get-show-answer-comment-btns__wrapper"]}>
        <StandartButton
          className={`
                ${listStyles["answer-comment-btn"]} 
                ${commentId ? listStyles["sub-btn"] : ""} 
                ${commentsAmountValue ? "" : listStyles["pairless-btn"]}`}
          onClick={() => {
            if (!userStore.isAuth) {
              alert("Authorize to have ability to leave the comments");
              return;
            }
            if (!userStore.userData.role?.addComment) {
              alert("You have no access to add comments");
              return;
            }
            setAddCommentFormOpen(!addCommentFormOpen);
          }}>
          {addCommentFormOpen ? "Close" : "Answer"}
        </StandartButton>
        {

          commentsAmountValue ?
            //If comments arent recieved from server yet, show button to send request
            !comments.rows.length ?
              <StandartButton
                className={`${listStyles["get-comments-btn"]} ${commentId ? listStyles["sub-btn"] : ""}`}
                onClick={onGetComments}>
                Get {getShowCommentsBtnText}
              </StandartButton>
              :
              //In other way, give ability to hide and show comments list
              <StandartButton
                className={`${listStyles["show-comments-btn"]} ${commentId ? listStyles["sub-btn"] : ""}`}
                onClick={() => setCommentsListIsOpen(!commentsListIsOpen)}>
                {
                  commentsListIsOpen ?
                    `Hide ${comments.rows.length} comment${comments.rows.length === 1 ? "" : "s"}`
                    :
                    `Show ${comments.rows.length} comment${comments.rows.length === 1 ? "" : "s"}`
                }
              </StandartButton>
            :
            null
        }
      </div>
      <ul className={`${listStyles["comment-list"]} ${commentsListIsOpen ? "" : listStyles['hidden']}`}>
        {comments.rows.map(comment =>
          <Fragment key={comment.id}>
            <CommentItem
              comment={comment}
              pictureAuthorId={pictureAuthorId}
              actualizeCommentListAfterDeleting={actualizeListAfterItemDelete} />
            <PictureCommentList
              pictureId={pictureId}
              pictureAuthorId={pictureAuthorId}
              commentId={comment.id}
              commentsAmount={Number(comment.childCommentsAmount) || 0}
            />
          </Fragment>
        )}
      </ul>
      {
        comments.rows.length !== comments.count ?
          <StandartButton
            onClick={onGetComments}>
            Get {getShowCommentsBtnText}
          </StandartButton>
          :
          null
      }

    </div>
  )
};

export default PictureCommentList;