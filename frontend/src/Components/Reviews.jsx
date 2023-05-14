import api from "../axios";
import { IntlProvider, FormattedMessage } from "react-intl";
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography, ThemeProvider } from "@material-ui/core";
import ReviewPost from "./ReviewPost";
import { darkTheme, lightTheme } from "../Styles/Theme";
import useStyles from "../Styles/AppStyles";

const Reviews = () => {
    const [popularReviews, setPopularReviews] = useState([]);
    const [latestReviews, setLatestReviews] = useState([]);
    const [likedReviews, setLikedReviews] = useState([]);
    const [ratedReviews, setRatedReviews] = useState([]);
    const [language] = useState(localStorage.getItem("language") || "en-US");
    const classes = useStyles();

    const getReviews = useCallback(async () => {
        try {
            const res = await api.get("/reviews");
            setPopularReviews(res.data.popularReviews);
            setLatestReviews(res.data.latestReviews);
            if (res.data.hasOwnProperty("liked_reviews"))
                setLikedReviews(res.data.liked_reviews);
            if(res.data.hasOwnProperty("rated_reviews"))
                setRatedReviews(res.data.rated_reviews);
        } catch (err) {
            console.error(err)
        };
    }, []);

    useEffect(() => {
        getReviews();
        const interval = setInterval(() => {
            getReviews();
        }, 3000);
        return () => clearInterval(interval);
    }, [getReviews]);

    return (
        <ThemeProvider theme={localStorage.getItem("isDarkMode") ? darkTheme : lightTheme} >
            <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
                <Grid container >
                    <Grid item xs={12} md={6} >
                    <Typography variant="h6" className={classes.homeHeadings}>
                        <FormattedMessage id="mostRatedReviewsTitle" defaultMessage="MOST RATED REVIEWS" />
                    </Typography>
                    {popularReviews.map((review) => (
                        <ReviewPost 
                            key={review.review_id} 
                            review={review} 
                            liked={likedReviews.includes(review.review_id)} 
                            rated={ratedReviews.includes(review.review_id)} />
                    ))}
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={classes.homeHeadings}>
                        <FormattedMessage id="latestReviewsTitle" defaultMessage="LATEST REVIEWS" />
                    </Typography>
                    {latestReviews.map((review) => (
                        <ReviewPost 
                            key={review.review_id} 
                            review={review} 
                            liked={likedReviews.includes(review.review_id)} 
                            rated={ratedReviews.includes(review.review_id)} 
                        />
                    ))}
                    </Grid>
                </Grid>
            </IntlProvider>
        </ThemeProvider>
    );
};

export default Reviews;