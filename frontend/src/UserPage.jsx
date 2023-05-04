import React, { useCallback, useEffect, useState } from "react";
import { Container, Typography, Button, MenuItem, Select } from "@material-ui/core";
import ReviewPost from "./ReviewPost";
import api from "./axios";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";

const UserPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username || null;
    const [userReviews, setUserReviews] = useState([]);
    const [sortOption, setSortOption] = useState("date");
    const [filterOption, setFilterOption] = useState("");

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };

    console.log(location.state)

    const handleCreateReview = () => {
        navigate("/create-review", {state: {username: username}});
    };

    const handleUpdateReview = (review) => {
        navigate("/create-review", {state:{review: review, username: username}})
    }

    const mainPage = () => {
        navigate("/");
    }

    const getUserReviews = useCallback(async () => {
        try {
            const res = await api.get(`/user/reviews?username=${username}`);
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

    const sortReviews = (reviews, sortOption) => {
        switch (sortOption) {
            case "title":
                return reviews.sort((a, b) => a.title.localeCompare(b.title));
            case "date":
                return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            default:
                return reviews;
        }
    };

    return (
        <div>
            <Header />
            <div style={{ float: "left", padding: "1em" }}>
                <Button
                variant="contained"
                color="primary"
                onClick={handleCreateReview}
                >
                Create Review
                </Button>
            </div>
            <div style={{ float: "right", padding: "1em" }}>
                <Button variant="contained" color="primary" onClick={mainPage}>
                Main Page
                </Button>
            </div>
            <Container maxWidth="md" style={{ paddingTop: "2em" }}>
                <Typography variant="h4" color="primary" align="center">
                    My Reviews
                </Typography>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Select value={sortOption} onChange={handleSortChange}>
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="popular">Popular</MenuItem>
                        <MenuItem value="mostRated">Most Rated</MenuItem>
                    </Select>
                    <Select value={filterOption} onChange={handleFilterChange}>
                        <MenuItem value="">Filter</MenuItem>
                        <MenuItem value="rating1">Rating from 1</MenuItem>
                        <MenuItem value="rating2">Rating from 2</MenuItem>
                        <MenuItem value="rating3">Rating from 3</MenuItem>
                        <MenuItem value="rating4">Rating from 4</MenuItem>
                        <MenuItem value="rating5">Rating from 5</MenuItem>
                        <MenuItem value="thisWeek">This week reviews</MenuItem>
                        <MenuItem value="highlyRated">Authors highly rated</MenuItem>
                    </Select>
                </div>
                {sortReviews(userReviews, "date").map((review) => (
                <div key={review.review_id}>
                    <ReviewPost review={review} liked={review.liked} />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(review.review_id)}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateReview(review)}
                    >
                        Edit
                    </Button>
                </div>
                ))}
            </Container>
        </div>
    );
};

export default UserPage;