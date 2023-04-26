import React, { useCallback, useState } from "react";
import { Card, CardHeader, CardContent, CardActions, Typography, Avatar, IconButton } from "@material-ui/core";
import { Favorite as FavoriteIcon } from "@material-ui/icons";
import Rating from '@material-ui/lab/Rating';
import ReviewModal from "./ReviewModal";
import usePostLike from "./ReviewLike";
import usePostRating from "./ReviewRate";


const ReviewPost = ({ review, liked, rated }) => {
    const [openReview, setOpenReview] = useState(false);
    const [likedByCurrentUser, setLikedByCurrentUser] = useState(liked);

    const { postRating } = usePostRating({ review_id: review.review_id });

    const postLike = usePostLike({
        review_id: review.review_id,
        initialLikes: review.like_count,
        initialIsLiked: liked,
    });

    const handleLikeButtonClick = useCallback(() => {
        postLike.postLike();
        setLikedByCurrentUser(!likedByCurrentUser);
    }, [likedByCurrentUser, postLike]);

    const handleOpen = useCallback(() => {
        setOpenReview(true);
    }, []);
    
    const handleClose = useCallback(() => {
        setOpenReview(false);
    }, []);

    return (
        <>
            <Card variant="outlined" style={{ margin: "16px 0" }}>
                <CardHeader
                    avatar={<Avatar>{review.creator_username.charAt(0)}</Avatar>}
                    title={review.creator_username}
                    subheader={new Date(review.creation_time).toLocaleString()}
                />
                <CardContent>
                    <Typography variant="h6">{review.category}</Typography>
                    <Typography variant="h5">
                    {review.title}
                    <Rating
                        name="rating"
                        value={review.users_rating}
                        precision={0.5}
                        onChange={(event, newValue) => {
                            postRating(newValue)
                        }}
                        disabled={rated}
                    />
                    </Typography>
                    <div onClick={handleOpen} style={{ cursor: "pointer" }}>
                        <Typography variant="subtitle1">{review.product_name}</Typography>
                        <Typography variant="body1">{review.content}</Typography>
                        <Typography variant="h6">Rating: {review.rate}</Typography>
                    </div>
                </CardContent>
                <CardActions disableSpacing color="secondary">
                    <IconButton
                        aria-label="Add to favorites"
                        style={{ color: likedByCurrentUser ? "#f50057" : "#808080" }}
                        onClick={handleLikeButtonClick}
                    >
                    <FavoriteIcon />
                    </IconButton>
                    <Typography variant="body2">{review.like_count}</Typography>
                </CardActions>
            </Card>
            <ReviewModal open={openReview} onClose={handleClose} review={review} liked={likedByCurrentUser} rated={rated} />
        </>
    );
};

export default ReviewPost;