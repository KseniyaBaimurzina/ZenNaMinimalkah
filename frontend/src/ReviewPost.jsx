import React, { useCallback, useState } from "react";
import { Card, CardHeader, CardContent, CardActions, Typography, Avatar, IconButton, Chip } from "@material-ui/core";
import { Favorite as FavoriteIcon } from "@material-ui/icons";
import ReactMarkdown from "react-markdown";
import Rating from '@material-ui/lab/Rating';
import usePostLike from "./ReviewLike";
import usePostRating from "./ReviewRate";
import api from "./axios";
import { useNavigate } from "react-router-dom";


const ReviewPost = ({ review, liked, rated }) => {
    const [likedByCurrentUser, setLikedByCurrentUser] = useState(liked);
    const [reviewCard, setReviewCard] = useState(review);
    const navigate = useNavigate();

    const { postRating } = usePostRating({ review_id: review.review_id, rated: rated });

    const postLike = usePostLike({
        review_id: review.review_id,
        initialLikes: review.like_count,
        initialIsLiked: liked,
    });

    const handleLikeButtonClick = useCallback(() => {
        postLike.postLike();
        setLikedByCurrentUser(!likedByCurrentUser);
    }, [likedByCurrentUser, postLike]);

    const tagSearch = useCallback(async(searchTag) =>{
        try {
            const res = await api.post("/search", { query: searchTag });
            navigate("/search-result", {state: {result: res.data, query: searchTag}})
        } catch(error){
            console.error(error)
        }
    });

    const handleOpen = useCallback(() => {
        navigate("/review-page", { state: { review: reviewCard, liked: likedByCurrentUser, rated: rated }});
    }, [navigate, reviewCard, likedByCurrentUser, rated]);
    

    return (
        <>
            <Card variant="outlined" style={{ margin: "16px 0" }}>
                <CardHeader
                    avatar={<Avatar>{review.creator_username.charAt(0)}</Avatar>}
                    title={review.creator_username}
                    subheader={new Date(review.creation_time).toLocaleString()}
                />
                <CardContent>
                    {review.review_tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            onClick={() => tagSearch(tag)}
                            style={{ cursor: "pointer" }}
                            size="small"
                        />
                    ))}
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
                    />
                    </Typography>
                    <div onClick={handleOpen} style={{ cursor: "pointer" }}>
                        <Typography variant="subtitle1">{review.product_name}</Typography>
                        <Typography variant="body1">
                            <ReactMarkdown>{review.content}</ReactMarkdown>
                        </Typography>
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
        </>
    );
};

export default ReviewPost;