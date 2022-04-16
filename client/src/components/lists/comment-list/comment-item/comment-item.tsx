import itemStyles from "./comment-item.module.css";
import PictureCommentLikeService from "../../../../services/picture-comment-like-service";
import PictureCommentService from "../../../../services/picture-comment-service";
import { getToLocaleStringData } from "../../../../utils/getToLocaleStringData";
import LikeEssenceBtn from "../../../btns/like-essence-btn/like-essence-btn";
import returnUserAvatar from "../../../../utils/img-utils/return-user-avatar";
import { IGetCommentsResponseObj } from "../../../../interfaces/http/response/pictureCommentInterfaces";
import { useCallback, useEffect, useState } from "react";

interface ICommentItemProps {
  comment: IGetCommentsResponseObj,
  parentCommentId?: number,
  pictureId: number,
  userId: number,
  setComments: React.Dispatch<React.SetStateAction<IGetCommentsResponseObj[]>>
}

const CommentItem = ({ comment, parentCommentId, pictureId, userId, setComments }: ICommentItemProps) => {
  const [editMode, setEditMode] = useState(false);
  const [commentText, setCommentText] = useState("");

  // const sendEditCommentRequest = () => {
  //   PictureCommentService.editComment(comment.id, commentText)
  // };

  // const actualizeComments = useCallback(async() =>{
  //   await PictureCommentService.getPictureComments(pictureId, parentCommentId || undefined).then(
  //     ({ data }) => setComments(data));
  // },[]);

  useEffect(() => {
    setCommentText(comment.text)
  }, [comment]);
  return (
    <li className={itemStyles["comment-item"]}>
      <section className={itemStyles["user-info"]}>
        <img className={itemStyles["user-avatar"]} alt={`${comment.user.nickname}'s avatar`} src={returnUserAvatar(comment.user.avatar)} />
        <p>{comment.user.nickname}</p>
        {
          userId === comment.userId ?
            <>
              <button onClick={() => setEditMode(!editMode)}>{editMode ? "Leave edit panel" : "Edit comment"}</button>
              {commentText !== comment.text ?
                <>
                  <button>Submit changes</button>
                  <button>Clear changes</button>
                </>
                :
                null}
            </>
            : null
        }
      </section>

      <hr></hr>

      <section className={itemStyles["comment-info"]}>
        {
          editMode ?
            <textarea className={itemStyles["comment__text-area"]}
              onChange={(e) => {
                setCommentText(e.target.value)
              }}>
              {commentText}
            </textarea>
            :
            <p>{comment.text}</p>
        }

        <div className={itemStyles["comment-bottom-section"]}>

          <div className={itemStyles["comment-like-block"]}>
            <LikeEssenceBtn
              iconClassName={itemStyles["like-btn"]}
              actualizeInfoAfterLike={async () => await PictureCommentService.getPictureComments(pictureId, parentCommentId || undefined).then(
                ({ data }) => setComments(data)
              )}
              sendLikeRequest={async () =>
                PictureCommentLikeService.likePictureComment(comment.id)
              }
              active={comment.commentLikes.some(({ userId: likeAuthor }) => likeAuthor === userId)} />
            <p>{comment.commentLikes.length}</p>
          </div>

          <div>
            <p className={itemStyles["comment-creation-date"]}>
              Created at: {getToLocaleStringData(comment.createdAt)}
            </p>
            <p className={itemStyles["comment-update-date"]}>
              {comment.createdAt === comment.updatedAt ? "" : `Last update: ${getToLocaleStringData(comment.updatedAt)}`}
            </p>
          </div>

        </div>
      </section>
    </li>
  )

};
export default CommentItem;