import { Fragment, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../../..";
import { IGetCommentByIdResponseObj, IGetCommentsResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";
import StandartButton from "../../../UI/standart-button/standart-button";
import GetPictureCommentsButton from "../../btns/get-picture-comments-btn/get-picture-comments-btn";
import CreateCommentForm from "../../forms/comment-forms/create-comment-form/create-comment-form";
import CommentItem from "./comment-item/comment-item";
import { ICommentListProps } from "./comment-list-interfaces";
import listStyles from "./comment-list.module.css";

const PictureCommentList = ({ pictureId, pictureAuthorId, commentId, commentsAmount = 0 }: ICommentListProps) => {
  const { userStore } = useContext(Context);

  const [commentsAmountValue, setCommentsAmountValue] = useState<number>(0);
  const [commentsListIsOpen, setCommentsListIsOpen] = useState(true);
  const [addCommentFormOpen, setAddCommentFormOpen] = useState(false);
  const [comments, setComments] = useState<IGetCommentsResponseObj>({ count: 0, rows: [] });
  const [commentsPaginationParams, setCommentsPaginationParams] = useState({ page: 1, limit: 4 });

  const actualizeListAfterItemDelete = useCallback((commentId: string | number) => {
    if (comments.rows.length) {
      setComments({ ...comments, count: +comments.count - 1, rows: comments.rows.filter(comment => +comment.id !== +commentId) });
      setCommentsAmountValue(commentsAmountValue ? Number(commentsAmountValue) - 1 : 0);
    }
  }, [comments, commentsAmountValue]);

  const actualizeListAfterItemCreation = useCallback((comment: IGetCommentByIdResponseObj) => {
    if (comments.rows.length) {
      setComments({ ...comments, rows: [{ ...comment, commentLikes: [] }, ...comments.rows] });
    }
    setCommentsAmountValue(commentsAmountValue ? Number(commentsAmountValue) + 1 : 1);
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

  console.log(getShowCommentsBtnText);

  useEffect(() => {
    setCommentsAmountValue(+commentsAmount);
  }, [commentsAmount]);

  return (
    <div className={`${listStyles["comment-list__wrapper"]} ${commentId ? listStyles["nested"] : ""}`}>
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
              <GetPictureCommentsButton
                className={`${listStyles["get-comments-btn"]} ${commentId ? listStyles["sub-btn"] : ""}`}
                pictureId={pictureId}
                commentId={commentId || 0}
                page={commentsPaginationParams.page}
                setPage={(page) => setCommentsPaginationParams({ ...commentsPaginationParams, page })}
                limit={commentsPaginationParams.limit}
                pictureComments={comments}
                setPictureComments={setComments} >
                Get {getShowCommentsBtnText}
              </GetPictureCommentsButton>
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
        comments.rows.length != comments.count ?
          <GetPictureCommentsButton
            pictureId={pictureId}
            commentId={commentId || 0}
            page={commentsPaginationParams.page}
            setPage={(page) => setCommentsPaginationParams({ ...commentsPaginationParams, page })}
            limit={commentsPaginationParams.limit}
            pictureComments={comments}
            setPictureComments={setComments} >
            Getol {getShowCommentsBtnText}
          </GetPictureCommentsButton>
          :
          null
      }

    </div>
  )
};

export default PictureCommentList;