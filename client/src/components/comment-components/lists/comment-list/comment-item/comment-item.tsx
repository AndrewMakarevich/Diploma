import itemStyles from "./comment-item.module.css";
import PictureCommentLikeService from "../../../../../services/picture-comment-like-service";
import PictureCommentService from "../../../../../services/picture-comment-service";
import { getToLocaleStringData } from "../../../../../utils/getToLocaleStringData";
import LikeEssenceBtn from "../../../../btns/like-essence-btn/like-essence-btn";
import returnUserAvatar from "../../../../../utils/img-utils/return-user-avatar";
import { IGetCommentByIdResponseObj } from "../../../../../interfaces/http/response/pictureCommentInterfaces";
import { useCallback, useContext, useEffect, useState } from "react";
import CommentValidator from "../../../../../validator/comment-validator";
import useFetching from "../../../../../hooks/useFetching";
import { ICommentItemProps } from "../comment-list-interfaces";
import DeleteCommentBtn from "../../../btns/delete-comment-btn/delete-comment-btn";
import { Context } from "../../../../..";
import { observer } from "mobx-react-lite";
import EditButton from "../../../../../UI/edit-button/edit-button";

const CommentItem = ({ comment, pictureAuthorId, actualizeCommentListAfterDeleting }: ICommentItemProps) => {
  const { userStore } = useContext(Context);
  const currentUserId = userStore.userData.id;

  const [commentObj, setCommentObj] = useState<IGetCommentByIdResponseObj>(
    {
      id: 0,
      text: "",
      createdAt: "",
      updatedAt: "",
      userId: 0,
      commentId: null,
      pictureId: 0,
      childCommentsAmount: 0,
      commentLikes: [],
      user: {
        avatar: "",
        nickname: ""
      }
    }
  );
  const [editMode, setEditMode] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentIsLiked, setCommentIsLiked] = useState(false);

  const sendEditCommentRequest = useCallback(async () => {
    CommentValidator.validateCommentText(commentText, true);
    await PictureCommentService.editComment(commentObj.id, commentText);

    setCommentObj({ ...commentObj, text: commentText });
    setEditMode(false);
  }, [commentText, commentObj, setCommentObj]);

  const { executeCallback: editComment, isLoading: editCommentLoading } = useFetching(sendEditCommentRequest);

  useEffect(() => {
    setCommentObj(comment);
    setCommentText(comment.text);
    setCommentIsLiked(comment.commentLikes?.some(({ userId: likeAuthor }) => likeAuthor === currentUserId));
  }, [comment, currentUserId]);

  return (
    <li className={itemStyles["comment-item"]}>
      <section className={itemStyles["user-info"]}>
        <div className={itemStyles["user-avatar-nickname"]}>
          <img className={itemStyles["user-avatar"]} alt={`${commentObj.user.nickname}'s avatar`} src={returnUserAvatar(commentObj.user.avatar)} />
          <p>{commentObj.user.nickname}</p>
        </div>
        {
          currentUserId === commentObj.userId ?
            <div className={itemStyles["edit-comment-panel"]}>
              <EditButton
                onClick={() => setEditMode(!editMode)}
                active={!!editMode}
              />
              {commentText !== commentObj.text && editMode ?
                <>
                  <button className={itemStyles["submit-changes-btn"]} disabled={editCommentLoading} onClick={editComment}>Submit</button>
                  <button className={itemStyles["clear-changes-btn"]} onClick={() => setCommentText(commentObj.text)}>Clear</button>
                </>
                :
                null}
            </div>
            : null
        }
        {
          !editMode && (currentUserId == pictureAuthorId || currentUserId == commentObj.userId) ?
            <DeleteCommentBtn commentId={commentObj.id} actualizeCommentListAfterDeleting={actualizeCommentListAfterDeleting} />
            :
            null
        }
      </section>

      <hr></hr>

      <section className={itemStyles["comment-info"]}>
        {
          editMode ?
            <textarea value={commentText} className={itemStyles["comment__text-area"]}
              onChange={(e) => {
                setCommentText(e.target.value)
              }} />
            :
            <p>{`${commentObj.text}`}</p>
        }

        <div className={itemStyles["comment-bottom-section"]}>

          <div className={itemStyles["comment-like-block"]}>
            <LikeEssenceBtn
              iconClassName={itemStyles["like-btn"]}
              actualizeInfoAfterLike={() => {
                const oppositeCommentIsLikedValue = !commentIsLiked;

                setCommentIsLiked(oppositeCommentIsLikedValue);
                //locally changing commentLikes array, to not to send additional request
                setCommentObj(
                  {
                    ...commentObj,
                    commentLikes:
                      oppositeCommentIsLikedValue ?
                        [...commentObj.commentLikes, { userId: currentUserId }]
                        :
                        commentObj.commentLikes.splice(0, commentObj.commentLikes.length - 1)
                  })
              }}
              sendLikeRequest={async () =>
                PictureCommentLikeService.likePictureComment(commentObj.id)
              }
              active={commentIsLiked} />
            <p>{commentObj.commentLikes?.length || 0}</p>
          </div>

          <div>
            <p className={itemStyles["comment-creation-date"]}>
              Created at: {getToLocaleStringData(commentObj.createdAt)}
            </p>
            <p className={itemStyles["comment-update-date"]}>
              {commentObj.createdAt === commentObj.updatedAt ? "" : `Last update: ${getToLocaleStringData(commentObj.updatedAt)}`}
            </p>
          </div>
        </div>
      </section>
    </li>
  )

};
export default observer(CommentItem);