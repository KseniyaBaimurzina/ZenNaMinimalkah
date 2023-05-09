import React, { useCallback, useState, useEffect } from "react";
import api from "./axios";
import { useNavigate, useLocation } from "react-router-dom";
import { IntlProvider, FormattedMessage, FormattedDate } from "react-intl";
import usePostLike from "./Components/ReviewLike";
import usePostRating from "./Components/ReviewRate";
import Header from "./Components/Header";
import { 
    TextField,
    List, 
    ListItem, 
    ListItemText, 
    Card, 
    CardHeader, 
    CardContent, 
    CardActions,
    Typography,
    Divider,
    Avatar,
    IconButton,
    Button,
    Chip
} from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import { Favorite as FavoriteIcon } from "@material-ui/icons";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Rating from '@material-ui/lab/Rating';

const ReviewPage = () => {
    const location = useLocation();
    const { review, liked, rated } = location.state;
    const navigate = useNavigate();
    const [language] = useState(localStorage.getItem("language") || "en-US");
    const [comments, setComments] = useState([]);
    const [likedByCurrentUser, setLikedByCurrentUser] = useState(liked);
    const [comment, setComment] = useState("");

    const postLike = usePostLike({
        review_id: review.review_id,
        initialLikes: review.like_count,
        initialIsLiked: likedByCurrentUser,
    });

    const { postRating } = usePostRating({ review_id: review.review_id, rated: rated });

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

    const tagSearch = useCallback(async(searchTag) =>{
        try {
            const res = await api.post("/search", { query: searchTag });
            navigate("/search-result", {state: {result: res.data, query: searchTag}})
        } catch(error){
            console.error(error)
        }
    });

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
        <IntlProvider locale={language} messages={require(`./Languages/${language}.json`)}>
            <Header />
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>
            <Card>
                <CardHeader
                    title={review.creator_username}
                    subheader={<FormattedDate
                        value={new Date(review.creation_time)}
                        dateStyle="medium"
                        timeStyle="short"
                        />}
                />
                <CardContent>
                    {review.review_tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            onClick={() => tagSearch(tag.tag)}
                            style={{ cursor: "pointer" }}
                            size="small"
                        />
                    ))}
                    <Typography variant="h6">
                        <FormattedMessage id={review.category} defaultMessage={review.category} />
                    </Typography>
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
                    <Typography variant="subtitle1" color="textSecondary"> {review.product_name} </Typography>
                    <Typography variant="body1">
                        <ReactMarkdown>{review.content}</ReactMarkdown>
                    </Typography>
                    <Typography variant="h6">
                        <FormattedMessage id="rating" defaultMessage="Rating" />: 
                        {review.rate}
                    </Typography>
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
                                    {<FormattedDate
                                        value={new Date(comment.creation_time)}
                                        dateStyle="medium"
                                        timeStyle="short"
                                    />}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    )}
                    <FormattedMessage id="commentLabel" defaultMessage="Comment">
                        {(message) => (
                            <TextField
                            fullWidth
                            margin="normal"
                            id="comment"
                            label={message}
                            multiline
                            minRows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            />
                        )}
                    </FormattedMessage>
                    <Button color="primary" onClick={publishComment}>
                        <FormattedMessage id="publishButton" defaultMessage="Publish" />
                    </Button>
                </CardContent>
            </Card>
        </IntlProvider>
    );
};

export default ReviewPage;