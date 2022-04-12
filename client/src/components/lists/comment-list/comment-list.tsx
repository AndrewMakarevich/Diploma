import { useEffect, useState } from "react";
import { IGetCommentsResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";
import PictureCommentService from "../../../services/picture-comment-service";
import GetPictureCommentsButton from "../../btns/get-picture-comments-btn/get-picture-comments-btn";
import listStyles from "./comment-list.module.css";

interface ICommentListProps {
  pictureId: number
}

const PictureCommentList = ({ pictureId }: ICommentListProps) => {

  const [comments, setComments] = useState<IGetCommentsResponseObj[]>([]);

  // useEffect(() => {
  //   if (pictureId) {
  //     PictureCommentService.getPictureComments(pictureId).then(({ data }) => setComments(data));
  //   }
  // }, [pictureId]);

  return (
    <>
      <GetPictureCommentsButton pictureId={pictureId} commentId={0} setPictureComments={setComments} >
        Get comments
      </GetPictureCommentsButton>
      <ul>
        {comments.map(comment =>
          <li>{JSON.stringify(comment)}</li>
        )}
      </ul>
    </>
  )
};

export default PictureCommentList;