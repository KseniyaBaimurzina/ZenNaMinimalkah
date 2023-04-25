import api from "./axios";
import { useCallback, useState } from "react";

const usePostLike = ({ review_id, initialLikes, initialIsLiked }) => {
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const postLike = useCallback(async () => {
    try {
      const res = await api.post("/like/", {
        review_id: review_id,
        is_liked: !likedByCurrentUser,
      });
      setLikedByCurrentUser(!likedByCurrentUser);
      setLikeCount(res.data.like_count);
    } catch (err) {
      console.error(err);
    }
  }, [likedByCurrentUser, review_id]);

  return { likeCount, postLike, likedByCurrentUser };
};

export default usePostLike;