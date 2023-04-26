import api from "./axios";
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography} from "@material-ui/core";
import ReviewPost from "./ReviewPost";

const Reviews = () => {
    const [popularReviews, setPopularReviews] = useState([]);
    const [latestReviews, setLatestReviews] = useState([]);
    const [likedReviews, setLikedReviews] = useState([]);
    const [ratedReviews, setRatedReviews] = useState([]);

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
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Typography variant="h6">Popular Reviews</Typography>
                {popularReviews.map((review) => (
                    <ReviewPost key={review.review_id} review={review} liked={likedReviews.includes(review.review_id)} rated={ratedReviews.includes(review.review_id)} />
                ))}
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6">Latest Reviews</Typography>
                {latestReviews.map((review) => (
                    <ReviewPost key={review.review_id} review={review} liked={likedReviews.includes(review.review_id)} rated={ratedReviews.includes(review.review_id)} />
                ))}
            </Grid>
        </Grid>
    );
};

export default Reviews;