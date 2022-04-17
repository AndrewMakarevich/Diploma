import itemStyles from "./comment-item.module.css";
import PictureCommentLikeService from "../../../../services/picture-comment-like-service";
import PictureCommentService from "../../../../services/picture-comment-service";
import { getToLocaleStringData } from "../../../../utils/getToLocaleStringData";
import LikeEssenceBtn from "../../../btns/like-essence-btn/like-essence-btn";
import returnUserAvatar from "../../../../utils/img-utils/return-user-avatar";
import { IGetCommentByIdResponseObj, IGetCommentsResponseObj } from "../../../../interfaces/http/response/pictureCommentInterfaces";
import { useCallback, useEffect, useState } from "react";
import CommentValidator from "../../../../validator/comment-validator";
import useFetching from "../../../../hooks/useFetching";
import CreateCommentForm from "../../../forms/comment-forms/create-comment-form/create-comment-form";
import { ICommentItemProps } from "../comment-list-interfaces";

const CommentItem = ({ commentId, userId }: ICommentItemProps) => {
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

  const getCommentById = useCallback(async () => {
    await PictureCommentService.getPictureComment(commentId).then(({ data }) => setCommentObj(data))
  }, [commentId]);

  const sendEditCommentRequest = useCallback(async () => {
    CommentValidator.validateCommentText(commentText, true);
    await PictureCommentService.editComment(commentObj.id, commentText);
    await getCommentById();
    setEditMode(false);
  }, [commentObj, commentText, getCommentById]);

  const { executeCallback: editComment, isLoading: editCommentLoading } = useFetching(sendEditCommentRequest)

  useEffect(() => {
    setCommentText(commentObj.text)
  }, [commentObj]);

  useEffect(() => {
    getCommentById();
  }, []);

  return (
    <li className={itemStyles["comment-item"]}>
      <section className={itemStyles["user-info"]}>
        <div className={itemStyles["user-avatar-nickname"]}>
          <img className={itemStyles["user-avatar"]} alt={`${commentObj.user.nickname}'s avatar`} src={returnUserAvatar(commentObj.user.avatar)} />
          <p>{commentObj.user.nickname}</p>
        </div>
        {
          userId === commentObj.userId ?
            <div className={itemStyles["edit-comment-panel"]}>
              <button onClick={() => setEditMode(!editMode)}>{editMode ? "Leave edit panel" : "Edit comment"}</button>
              {commentText !== commentObj.text ?
                <>
                  <button disabled={editCommentLoading} onClick={editComment}>Submit changes</button>
                  <button onClick={() => setCommentText(commentObj.text)}>Clear changes</button>
                </>
                :
                null}
            </div>
            : null
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
              actualizeInfoAfterLike={async () => await getCommentById()}
              sendLikeRequest={async () =>
                PictureCommentLikeService.likePictureComment(commentObj.id)
              }
              active={commentObj.commentLikes.some(({ userId: likeAuthor }) => likeAuthor === userId)} />
            <p>{commentObj.commentLikes.length}</p>
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
export default CommentItem;