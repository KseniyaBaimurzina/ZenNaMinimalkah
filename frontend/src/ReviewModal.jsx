import React, { useCallback, useState, useEffect } from "react";
import api from "./axios";
import { makeStyles } from "@material-ui/core/styles";
import usePostLike from "./ReviewLike";
import usePostRating from "./ReviewRate";
import { 
    TextField,
    List, 
    ListItem, 
    ListItemText, 
    Modal, 
    Backdrop, 
    Fade, 
    Card, 
    CardHeader, 
    CardContent, 
    CardActions,
    Typography,
    Divider,
    Avatar,
    IconButton,
    Button
} from "@material-ui/core";
import { Favorite as FavoriteIcon } from "@material-ui/icons";
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        maxHeight: '100%',
    },
    paper: {
        width: '70%',
        height: '90%',
        maxWidth: '800px',
        maxHeight: '1000px',
        margin: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const ReviewModal = ({ review, open, onClose, liked, rated }) => {
    const classes = useStyles();
    const [comments, setComments] = useState([]);
    const [likedByCurrentUser, setLikedByCurrentUser] = useState(liked);
    const [comment, setComment] = useState("");

    const postLike = usePostLike({
        review_id: review.review_id,
        initialLikes: review.like_count,
        initialIsLiked: likedByCurrentUser,
    });

    const { postRating } = usePostRating({ review_id: review.review_id });

    const getComments = useCallback(async () => {
        try {
            const res = await api.get("/review/comments", {
                params: { review_id: review.review_id }
            });
            setComments(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [review.review_id]);

    const publishComment = useCallback(async () => {
        try {
            await api.post("comment", {
                review_id: review.review_id, comment: comment
            });
            setComment("");
        } catch (err) {
            console.error(err);
        }
    }, [comment, review.review_id]);

    const handleLikeButtonClick = useCallback(() => {
        postLike.postLike();
        setLikedByCurrentUser(!likedByCurrentUser);
    }, [likedByCurrentUser, postLike]);

    useEffect(() => {
        getComments();
        const interval = setInterval(() => {
            getComments();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Modal
            className={classes.modal}
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
        <Fade in={open}>
            <div className={classes.paper}>
            <Card>
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
                    <Typography variant="subtitle1" color="textSecondary"> {review.product_name} </Typography>
                    <Typography variant="body1">{review.content}</Typography>
                    <Typography variant="h6">Rating: {review.rate}</Typography>
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
                    <Divider style={{ margin: '16px 0' }} />
                    {comments.length === 0 ? (
                        <Typography variant="subtitle2">No comments yet</Typography>
                    ) : (
                        <List>
                            {comments.map((comment) => (
                                <ListItem key={comment.comment_id}>
                                    <ListItemText
                                        primary={comment.creator_username}
                                        secondary={comment.text}
                                    />
                                    <Typography variant="caption">
                                        {new Date(comment.creation_time).toLocaleString()}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    )}
                    <TextField
                        fullWidth
                        margin="normal"
                        id="comment"
                        label="Comment"
                        multiline
                        minRows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button color="primary" onClick={publishComment}>
                        Publish
                    </Button>
                </CardContent>
            </Card>
            </div>
        </Fade>
        </Modal>
    );
};

export default ReviewModal;