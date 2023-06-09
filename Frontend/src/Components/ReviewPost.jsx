import React, { useCallback, useState } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import { Card, Button, CardHeader, CardContent, CardActions, Typography, IconButton, Chip, ThemeProvider } from "@material-ui/core";
import { Favorite as FavoriteIcon, Clear, Edit } from "@material-ui/icons";
import ReactMarkdown from "react-markdown";
import Rating from '@material-ui/lab/Rating';
import usePostLike from "./ReviewLike";
import usePostRating from "./ReviewRate";
import api from "../axios";
import { useNavigate, useLocation } from "react-router-dom";
import useStyles from "../Styles/AppStyles";
import { lightTheme, darkTheme } from "../Styles/Theme";
import { formatDistanceToNow } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';


const ReviewPost = ({ review, liked, rated, userLikes, username=null }) => {
    const classes = useStyles();
    const [likedByCurrentUser, setLikedByCurrentUser] = useState(liked);
    const [showFullContent, setShowFullContent] = useState(false);
    const [content, setContent] = useState(review.content.split(" ").slice(0, 50).join(" ") + "...");
    const [language] = useState(localStorage.getItem("language") || "en-US");
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const theme = localStorage.getItem("isDarkMode") === 'true' ? darkTheme : lightTheme;
    const dateLocale = {
        "en-US": enUS,
        "zh-CN": zhCN
    }

    const postRating = usePostRating({
        review_id: review.review_id,
        rated: rated
    });

    const handleRate = useCallback((event,rating) =>{
        postRating.postRating(rating)
    },[]);

    const postLike = usePostLike({
        review_id: review.review_id,
        initialLikes: review.like_count,
        initialIsLiked: liked
    });

    const handleLikeButtonClick = useCallback(() => {
        postLike.postLike();
        setLikedByCurrentUser(!likedByCurrentUser);
    }, [likedByCurrentUser, postLike]);

    const tagSearch = (async(searchTag) =>{
        try {
            const res = await api.post("/search", { query: searchTag });
            navigate("/search-result", {state: {result: res.data, query: searchTag}})
        } catch(error){
            console.error(error)
        }
    });

    const handleOpen = useCallback(() => {
        navigate("/review-page", { state: { review: review, liked: likedByCurrentUser, rated: rated, userLikes: userLikes }});
    }, [navigate, review, likedByCurrentUser, rated]);

    const handleOpenText = () => {
        setContent(review.content);
        setShowFullContent(true);
    }

    const dateToNow = (dateStr) => {
        const date = new Date(dateStr);
        const locale = dateLocale[localStorage.getItem("language")] || enUS;
        const formattedDate = formatDistanceToNow(date, { addSuffix: true, locale: locale});
        return formattedDate
    }

    const handleUpdateReview = (review) => {
        navigate("/create-review", {state:{review: review, username: username}})
    }
    const handleDelete = useCallback(async (reviewId) => {
            try {
                await api.delete("/review", { data: { review_id: reviewId } });
            } catch (err) {
                console.error(err);
            }
        }, []);

    const creatorButtons = currentPath === '/user/reviews' ? (
        <div>
            <Button
                color='secondary'
                onClick={() => handleDelete(review.review_id)}
                className={classes.deleteButton}
            >
                <Clear/>
            </Button>
            <Button
                color='secondary'
                onClick={() => handleUpdateReview(review)}
            >
                <Edit />
            </Button> 
        </div>
        ) : null;

    return (
        <ThemeProvider theme={theme}>
            <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
                <Card variant="outlined" className={classes.card}>

                    <div className={classes.userPageReview}>
                        <CardHeader
                            style={{ width: '100%' }}
                            subheader={
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
                                    <Typography variant="h8">
                                        <FormattedMessage id="createdByLable" defaultMessage="Created by"/> {review.creator_username} | {userLikes[review.creator_username]}
                                            <FavoriteIcon color="secondary" fontSize="inherit" />
                                    </Typography>
                                    <Typography variant="h8">{dateToNow(review.creation_time)}</Typography>
                                </div>
                            }
                            title={
                                    <Typography variant="h5" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {review.title}
                                    <Rating
                                    name={`rating-${review.review_id}`}
                                    value={review.users_rating}
                                    precision={0.5}
                                    onChange={(e, value) =>handleRate(e,value)}
                                />
                                    </Typography>
                            }
                            
                            className={classes.cardHeader}
                        />
                        <div className={classes.cardButtons}>
                            {creatorButtons}
                        </div>
                    </div>
                    <CardContent>
                        <Typography variant="h6">
                            <FormattedMessage id={review.category} defaultMessage={review.category} />
                            {review.review_tags.map((tag, index) => (
                                <Chip
                                    style={{backgroundColor: theme.palette.background.tags, color: theme.palette.text.primary, marginLeft: "5px"}}
                                    size="small"
                                    key={index}
                                    label={tag}
                                    onClick={() => tagSearch(tag)}
                                />
                            ))}
                        </Typography>
                            <Typography variant="subtitle1" onClick={handleOpen} className={classes.clickable}>{review.product_name}</Typography>
                            <Typography variant="body1">
                                <ReactMarkdown>{content}</ReactMarkdown>
                                {!showFullContent && review.content.length > 50 && (
                                    <Button variant="text" onClick={handleOpenText}>
                                        <FormattedMessage id="readMoreTitle" defaultMessage="read more" />
                                    </Button>
                                )}
                            </Typography>
                            <Typography variant="h6" onClick={handleOpen} className={classes.clickable}>
                                <FormattedMessage id="rating" defaultMessage="Rating" />: {review.rate}
                            </Typography>
                    </CardContent>
                    <CardActions disableSpacing color="secondary">
                        <IconButton
                            aria-label="Add to favorites"
                            style={{ color: likedByCurrentUser ? "#b61261" : "#808080" }}
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