import { Fragment, useEffect, useState } from "react";
import { IGetCommentsResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";
import PictureCommentService from "../../../services/picture-comment-service";
import StandartButton from "../../../UI/standart-button/standart-button";
import GetPictureCommentsButton from "../../btns/get-picture-comments-btn/get-picture-comments-btn";
import CommentItem from "./comment-item/comment-item";
import listStyles from "./comment-list.module.css";

interface ICommentListProps {
  userId: number,
  pictureId: number,
  commentId?: number,
  commentsAmount?: number | null,
  commentToAdd?: IGetCommentsResponseObj
}

const PictureCommentList = ({ userId, pictureId, commentId, commentsAmount, commentToAdd }: ICommentListProps) => {
  const [commentsListIsOpen, setCommentsListIsOpen] = useState(true);
  const [comments, setComments] = useState<IGetCommentsResponseObj[]>([]);
  const [commentToAddInChildList, setCommentToAddInChildList] = useState<IGetCommentsResponseObj | undefined>();

  // const getComments = async () => {
  //   const response = await PictureCommentService.getPictureComments(pictureId, commentId);

  //   setComments(response.data);
  // };

  useEffect(() => {
    // If the list of comments has already been receieved, then when an amount of child comments of parent comment changes, actualize comment list
    if (commentToAdd && comments.length) {
      setComments([...comments, commentToAdd])
      console.log('comment list updated');
    }
  }, [commentToAdd]);
  useEffect(() => {
    console.log(comments);
  }, [comments]);

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
                <CommentItem
                  commentId={comment.id}
                  parentCommentId={commentId}
                  pictureId={pictureId}
                  userId={userId}
                  setChildComment={setCommentToAddInChildList} />
                {
                  Number(comment.childCommentsAmount) || commentToAddInChildList ?
                    <PictureCommentList
                      userId={userId}
                      pictureId={pictureId}
                      commentId={comment.id}
                      commentsAmount={commentToAddInChildList ? Number(comment.childCommentsAmount) + 1 : comment.childCommentsAmount}
                      commentToAdd={commentToAddInChildList}
                    />

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