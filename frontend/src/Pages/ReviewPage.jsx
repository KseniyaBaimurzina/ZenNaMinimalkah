import React, { useCallback, useState, useEffect } from "react";
import api from "../axios";
import { useNavigate, useLocation } from "react-router-dom";
import { IntlProvider, FormattedMessage, FormattedDate } from "react-intl";
import Header from "../Components/Header";
import { 
    TextField,
    List, 
    ListItem, 
    ListItemText, 
    Typography,
    Divider,
    IconButton,
    Button,
    Container
} from "@material-ui/core";
import ReviewPost from "../Components/ReviewPost";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useStyles from "../Styles/AppStyles";
import { fetchToken } from "../Components/Auth";

const ReviewPage = () => {
    const location = useLocation();
    const classes = useStyles();
    const { review, liked, rated, userLikes } = location.state;
    const navigate = useNavigate();
    const [language] = useState(localStorage.getItem("language") || "en-US");
    const [comments, setComments] = useState([]);
    const likedByCurrentUser = liked;
    const [comment, setComment] = useState("");

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

    useEffect(() => {
        getComments();
        const interval = setInterval(() => {
            getComments();
        }, 3000);
        return () => clearInterval(interval);
    }, [getComments]);

    const commentCreation = fetchToken() ? (
        <>
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
            <Button variant='contained' color="primary" onClick={publishComment}>
                <FormattedMessage id="publishButton" defaultMessage="Publish" />
            </Button>
        </>
    ) : null;

    return (
        <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
            <Header />
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>
            <Container className={classes.reviewPageContainer} >
                <ReviewPost review={review} liked={likedByCurrentUser} rated={rated} userLikes={userLikes} />
                <Container style={{marginBottom: '15px'}}>
                    <Divider style={{ margin: '16px 0' }} />
                    {comments.length === 0 ? (
                        <Typography variant="subtitle2">
                            <FormattedMessage id="commentAbsentTitle" defaultMessage="No comments yet" />
                        </Typography>
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
                    {commentCreation}
                </Container>
            </Container>
        </IntlProvider>
    );
};

export default ReviewPage;