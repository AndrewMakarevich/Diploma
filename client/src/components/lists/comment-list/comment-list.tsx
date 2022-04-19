import { Fragment, useCallback, useEffect, useState } from "react";
import { IGetCommentByIdResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";
import StandartButton from "../../../UI/standart-button/standart-button";
import GetPictureCommentsButton from "../../btns/get-picture-comments-btn/get-picture-comments-btn";
import CreateCommentForm from "../../forms/comment-forms/create-comment-form/create-comment-form";
import CommentItem from "./comment-item/comment-item";
import { ICommentListProps } from "./comment-list-interfaces";
import listStyles from "./comment-list.module.css";

const PictureCommentList = ({ userId, pictureId, pictureAuthorId, commentId, commentsAmount }: ICommentListProps) => {
  const [childCommentsAmount, setChildCommentsAmount] = useState<string | number | undefined | null>();
  const [commentsListIsOpen, setCommentsListIsOpen] = useState(true);
  const [addCommentFormOpen, setAddCommentFormOpen] = useState(false);
  const [comments, setComments] = useState<IGetCommentByIdResponseObj[]>([]);

  const actualizeListAfterItemDelete = useCallback((commentId: string | number) => {
    if (comments.length) {
      setComments(comments.filter(comment => comment.id != commentId));
      setChildCommentsAmount(childCommentsAmount ? Number(childCommentsAmount) - 1 : null);
    }
  }, [setComments, comments]);

  useEffect(() => {
    setChildCommentsAmount(commentsAmount);
  }, [commentsAmount])

  return (
    <div className={`${listStyles["comment-list__wrapper"]} ${commentId ? listStyles["nested"] : ""}`}>
      {
        addCommentFormOpen ?
          <CreateCommentForm
            pictureId={pictureId}
            commentId={commentId}
            actualizeCommentList={(comment: IGetCommentByIdResponseObj) => {
              if (comments.length) {
                setComments([comment, ...comments]);
              }
              setChildCommentsAmount(childCommentsAmount ? Number(childCommentsAmount) + 1 : 1);
            }}
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
          childCommentsAmount === null || childCommentsAmount === undefined || childCommentsAmount ?
            //If comments arent recieved from server yet, show button to send request
            !comments.length ?
              <GetPictureCommentsButton
                className={`${listStyles["get-comments-btn"]} ${commentId ? listStyles["sub-btn"] : ""}`}
                pictureId={pictureId}
                commentId={commentId || 0}
                setPictureComments={setComments} >
                Get {childCommentsAmount} comments
              </GetPictureCommentsButton>
              :
              //In other way, give ability to hide and show comments list
              <StandartButton
                className={`${listStyles["show-comments-btn"]} ${commentId ? listStyles["sub-btn"] : ""}`}
                onClick={() => setCommentsListIsOpen(!commentsListIsOpen)}>
                {
                  commentsListIsOpen ?
                    `Hide ${childCommentsAmount || ""} comments`
                    :
                    `Show ${childCommentsAmount || ""} comments`
                }
              </StandartButton>

            :
            null
        }
      </div>
      <ul className={`${listStyles["comment-list"]} ${commentsListIsOpen ? "" : listStyles['hidden']}`}>
        {comments.map(comment =>
          <Fragment key={comment.id}>
            <CommentItem
              comment={comment}
              userId={userId}
              pictureAuthorId={pictureAuthorId}
              actualizeCommentListAfterDeleting={actualizeListAfterItemDelete} />
            <PictureCommentList
              userId={userId}
              pictureId={pictureId}
              pictureAuthorId={pictureAuthorId}
              commentId={comment.id}
              commentsAmount={Number(comment.childCommentsAmount) || 0}
            />
          </Fragment>
        )}
      </ul>
    </div>
  )
};

export default PictureCommentList;