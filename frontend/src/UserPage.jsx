import React, { useCallback, useEffect, useState } from "react";
import { Container, Typography, Button } from "@material-ui/core";
import ReviewPost from "./ReviewPost";
import api from "./axios";
import { useNavigate, Navigate } from "react-router-dom";

const UserPage = () => {
    const navigate = useNavigate();
    const [userReviews, setUserReviews] = useState([]);

    const handleCreateReview = () => {
        navigate("/create-review");
    };

    const getUserReviews = useCallback(async () => {
        try {
            const res = await api.get("/user/reviews", {
                params: { offset: 1 }, //Make offset change with scrolling
            });
            setUserReviews(res.data);
            console.log(JSON.stringify(userReviews))
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleDelete = useCallback(async (reviewId) => {
        try {
            await api.delete("/review", { review_id: reviewId });
            setUserReviews((prevReviews) =>
                prevReviews.filter((review) => review.review_id !== reviewId)
            );
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        getUserReviews();
    }, [getUserReviews]);

    return (
        <Container maxWidth="md">
            <Button 
                variant="contained"
                color="primary" 
                onClick={handleCreateReview}>
                    Create Review
            </Button>
            <Typography variant="h4">My Reviews</Typography>
            {userReviews.map((review) => (
                <div key={review.review_id}>
                    <ReviewPost review={review} liked={review.liked} />
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(review.review_id)}>
                        Delete
                    </Button>
                </div>
            ))}
        </Container>
    );
};

export default UserPage;