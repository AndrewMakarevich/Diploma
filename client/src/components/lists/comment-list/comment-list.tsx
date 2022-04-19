import { Fragment, useCallback, useEffect, useState } from "react";
import { IGetCommentByIdResponseObj, IGetCommentsResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";
import StandartButton from "../../../UI/standart-button/standart-button";
import GetPictureCommentsButton from "../../btns/get-picture-comments-btn/get-picture-comments-btn";
import CreateCommentForm from "../../forms/comment-forms/create-comment-form/create-comment-form";
import CommentItem from "./comment-item/comment-item";
import { ICommentListProps } from "./comment-list-interfaces";
import listStyles from "./comment-list.module.css";

const PictureCommentList = ({ pictureId, pictureAuthorId, commentId, commentsAmount }: ICommentListProps) => {
  const [commentsAmountValue, setCommentsAmountValue] = useState<string | number | undefined | null>();
  const [commentsListIsOpen, setCommentsListIsOpen] = useState(true);
  const [addCommentFormOpen, setAddCommentFormOpen] = useState(false);
  const [comments, setComments] = useState<IGetCommentsResponseObj>({ count: 0, rows: [] });
  const [commentsPaginationParams, setCommentsPaginationParams] = useState({ page: 1, limit: 1 });

  const actualizeListAfterItemDelete = useCallback((commentId: string | number) => {
    if (comments.rows.length) {
      setComments({ ...comments, rows: comments.rows.filter(comment => comment.id != commentId) });
      setCommentsAmountValue(commentsAmountValue ? Number(commentsAmountValue) - 1 : null);
    }
  }, [comments, commentsAmountValue]);

  const actualizeListAfterItemCreation = useCallback((comment: IGetCommentByIdResponseObj) => {
    if (comments.rows.length) {
      setComments({ ...comments, rows: [{ ...comment, commentLikes: [] }, ...comments.rows] });
    }
    setCommentsAmountValue(commentsAmountValue ? Number(commentsAmountValue) + 1 : 1);
  }, [comments, commentsAmountValue])

  useEffect(() => {
    setCommentsAmountValue(commentsAmount);
  }, [commentsAmount])

  return (
    <div className={`${listStyles["comment-list__wrapper"]} ${commentId ? listStyles["nested"] : ""}`}>
      {
        addCommentFormOpen ?
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
          className={`${listStyles["answer-comment-btn"]} ${commentId ? listStyles["sub-btn"] : ""}`}
          onClick={() => {
            setAddCommentFormOpen(!addCommentFormOpen);
          }}>
          {addCommentFormOpen ? "Close" : "Answer"}

        </StandartButton>
        {
          commentsAmountValue === null || commentsAmountValue === undefined || commentsAmountValue ?
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
                Get {commentsAmountValue} comments
              </GetPictureCommentsButton>
              :
              //In other way, give ability to hide and show comments list
              <StandartButton
                className={`${listStyles["show-comments-btn"]} ${commentId ? listStyles["sub-btn"] : ""}`}
                onClick={() => setCommentsListIsOpen(!commentsListIsOpen)}>
                {
                  commentsListIsOpen ?
                    `Hide ${commentsAmountValue || ""} comments`
                    :
                    `Show ${commentsAmountValue || ""} comments`
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
            Get more comments ({+comments.count - ((commentsPaginationParams.page - 1) * commentsPaginationParams.limit)} remaining)
          </GetPictureCommentsButton>
          :
          null
      }

    </div>
  )
};

export default PictureCommentList;