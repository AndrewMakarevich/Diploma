import { Fragment, useEffect, useState } from "react";
import { IGetCommentsResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";
import PictureCommentLikeService from "../../../services/picture-comment-like-service";
import PictureCommentService from "../../../services/picture-comment-service";
import StandartButton from "../../../UI/standart-button/standart-button";
import { getToLocaleStringData } from "../../../utils/getToLocaleStringData";
import returnUserAvatar from "../../../utils/img-utils/return-user-avatar";
import GetPictureCommentsButton from "../../btns/get-picture-comments-btn/get-picture-comments-btn";
import LikeEssenceBtn from "../../btns/like-essence-btn/like-essence-btn";
import CommentItem from "./comment-item/comment-item";
import listStyles from "./comment-list.module.css";

interface ICommentListProps {
  userId: number,
  pictureId: number,
  commentId?: number,
  commentsAmount?: number | null
}

const PictureCommentList = ({ userId, pictureId, commentId, commentsAmount }: ICommentListProps) => {
  const [commentsListIsOpen, setCommentsListIsOpen] = useState(true);
  const [comments, setComments] = useState<IGetCommentsResponseObj[]>([]);

  return (
    <div className={listStyles["comment-list__wrapper"]}>
      {
        //If comments arent recieved from server yet, show button to send request
        !comments.length ?
          <GetPictureCommentsButton pictureId={pictureId} commentId={commentId || 0} setPictureComments={setComments} >
            Get {commentsAmount || ""} comments
          </GetPictureCommentsButton>
          :
          //In other way, give ability to hide and show comments list
          <StandartButton onClick={() => setCommentsListIsOpen(!commentsListIsOpen)}>
            {
              commentsListIsOpen ?
                `Hide ${commentsAmount || ""} comments`
                :
                `Show ${commentsAmount || ""} comments`
            }
          </StandartButton>
      }
      {
        commentsListIsOpen ?
          <ul className={listStyles["comment-list"]}>
            {comments.map(comment =>
              <Fragment key={comment.id}>
                <CommentItem comment={comment} parentCommentId={commentId} pictureId={pictureId} userId={userId} setComments={setComments} />
                {
                  Number(comment.childCommentsAmount) ?
                    <PictureCommentList userId={userId} pictureId={pictureId} commentId={comment.id} commentsAmount={comment.childCommentsAmount} />
                    :
                    null
                }
              </Fragment>
            )}
          </ul>
          :
          null
      }
    </div>
  )
};

export default PictureCommentList;