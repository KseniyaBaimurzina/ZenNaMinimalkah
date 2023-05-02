import React, { useCallback, useEffect, useState } from "react";
import { Container, Typography, Button } from "@material-ui/core";
import ReviewPost from "./ReviewPost";
import api from "./axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const UserPage = () => {
    const navigate = useNavigate();
    const [userReviews, setUserReviews] = useState([]);

    const handleCreateReview = () => {
        navigate("/create-review");
    };

    const handleUpdateReview = (review) => {
        navigate("/create-review", {state:{review: review}})
    }

    const mainPage = () => {
        navigate("/");
    }

    const getUserReviews = useCallback(async () => {
        try {
            const res = await api.get("/user/reviews");
            setUserReviews(res.data);
            console.log(JSON.stringify(userReviews))
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleDelete = useCallback(async (reviewId) => {
        try {
            console.log(reviewId)
            await api.delete("/review", { data: { review_id: reviewId } });
            setUserReviews((prevReviews) =>
                prevReviews.filter((review) => review.review_id !== reviewId)
            );
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        getUserReviews();
        const interval = setInterval(() => {
            getUserReviews();
        }, 3000);
        return () => clearInterval(interval);
    }, [getUserReviews]);

    return (
        <div>
            <Header />
            <div style={{float: 'right', padding: '1em'}}>
                <Button variant="contained" color="primary" onClick={mainPage}>Main Page</Button>
            </div>
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
                        <Button variant="contained" color="primary" onClick={() => handleUpdateReview(review)}>
                            Edit
                        </Button>
                    </div>
                ))}
            </Container>
        </div>
    );
};

export default UserPage;