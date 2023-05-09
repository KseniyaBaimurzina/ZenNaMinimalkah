import React, { useCallback, useState } from "react";
import { IntlProvider, FormattedMessage, FormattedDate } from "react-intl";
import { Card, Button, CardHeader, CardContent, CardActions, Typography, IconButton, Chip, ThemeProvider } from "@material-ui/core";
import { Favorite as FavoriteIcon } from "@material-ui/icons";
import ReactMarkdown from "react-markdown";
import Rating from '@material-ui/lab/Rating';
import usePostLike from "./ReviewLike";
import usePostRating from "./ReviewRate";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import useStyles from "../Styles/AppStyles";
import { lightTheme, darkTheme } from "../Styles/Theme";

const ReviewPost = ({ review, liked, rated }) => {
    const classes = useStyles();
    const [likedByCurrentUser, setLikedByCurrentUser] = useState(liked);
    const [language] = useState(localStorage.getItem("language") || "en-US");
    const navigate = useNavigate();
    const theme = localStorage.getItem("isDarkMode") === 'true' ? darkTheme : lightTheme;

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
    
    const words = review.content.split(" ");
    const content = words.slice(0, 50).join(" ") + "...";

    const tagSearch = useCallback(async(searchTag) =>{
        try {
            const res = await api.post("/search", { query: searchTag });
            navigate("/search-result", {state: {result: res.data, query: searchTag}})
        } catch(error){
            console.error(error)
        }
    });

    const handleOpen = useCallback(() => {
        navigate("/review-page", { state: { review: review, liked: likedByCurrentUser, rated: rated }});
    }, [navigate, review, likedByCurrentUser, rated]);
    

    return (
        <ThemeProvider theme={theme}>
            <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
                <Card variant="outlined" className={classes.card}>
                    <CardHeader
                        title={review.creator_username}
                        subheader={<FormattedDate
                            value={new Date(review.creation_time)}
                            dateStyle="medium"
                            timeStyle="short"
                        />}
                    />
                    <CardContent>
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
                        <Typography variant="h6">
                            <FormattedMessage id={review.category} defaultMessage={review.category} />
                            {review.review_tags.map((tag, index) => (
                                <Chip
                                    className={classes.chipComponent}
                                    key={index}
                                    label={tag}
                                    onClick={() => tagSearch(tag)}
                                />
                            ))}
                        </Typography>
                        <div onClick={handleOpen} style={{ cursor: "pointer" }}>
                            <Typography variant="subtitle1">{review.product_name}</Typography>
                            <Typography variant="body1">
                                <ReactMarkdown>{content}</ReactMarkdown>
                                {words.length > 50 && (
                                    <Button variant="text" onClick={handleOpen}>
                                        <FormattedMessage id="readMoreTitle" defaultMessage="read more" />
                                    </Button>
                                )}
                            </Typography>
                            <Typography variant="h6">
                                <FormattedMessage id="rating" defaultMessage="Rating" />: {review.rate}
                            </Typography>
                        </div>
                    </CardContent>
                    <CardActions disableSpacing color="secondary">
                        <IconButton
                            aria-label="Add to favorites"
                            style={{ color: likedByCurrentUser ? "#b51261" : "#808080" }}
                            onClick={handleLikeButtonClick}
                        >
                        <FavoriteIcon />
                            </IconButton>
                        <Typography variant="body2">{review.like_count}</Typography>
                    </CardActions>
                </Card>
            </IntlProvider>
        </ThemeProvider>
    );
};

export default ReviewPost;