import React, { useCallback, useEffect, useState } from "react";
import { Container, Typography, Button, MenuItem, Select, FormControl, InputLabel } from "@material-ui/core";
import ReviewPost from "./ReviewPost";
import api from "./axios";
import { useNavigate, useLocation } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";
import Header from "./Header";

const UserPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username || null;
    const [userReviews, setUserReviews] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const [filterOption, setFilterOption] = useState("");
    const [language] = useState(localStorage.getItem("language"));

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };

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
        } catch (err) {
            console.error(err);
        }
    }, [username]);

    const handleDelete = useCallback(async (reviewId) => {
        try {
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

    const sortReviews = (reviews, sortOption, filterOption) => {
        let filteredReviews = reviews;
        switch (filterOption) {
            case "rating1":
                filteredReviews = filteredReviews.filter((review) => review.users_rating >= 1);
                break;
            case "rating2":
                filteredReviews = filteredReviews.filter((review) => review.users_rating >= 2);
                break;
            case "rating3":
                filteredReviews = filteredReviews.filter((review) => review.users_rating >= 3);
                break;
            case "rating4":
                filteredReviews = filteredReviews.filter((review) => review.users_rating >= 4);
                break;
            case "rating5":
                filteredReviews = filteredReviews.filter((review) => review.users_rating === 5);
                break;
            case "thisWeek":
                const today = new Date();
                const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                filteredReviews = filteredReviews.filter((review) => new Date(review.date) >= weekAgo);
                break;
            case "highlyRated":
                filteredReviews = filteredReviews.filter((review) => review.rate >= 6);
                break;
            default:
                break;
        }
        switch (sortOption) {
            case "likes":
                return filteredReviews.sort((a, b) => b.like_count - a.like_count);
            case "date":
                return filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            case "rating":
                return filteredReviews.sort((a, b) => b.users_rating - a.users_rating);
            default:
                return filteredReviews;
        }
    };

    return (
        <IntlProvider locale={language} messages={require(`./Languages/${language}.json`)}>
            <Header />
            <div style={{ float: "left", padding: "1em" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateReview}
                >
                    <FormattedMessage id="createReviewButton" defaultMessage="Create Review" />
                </Button>
            </div>
            <div style={{ float: "right", padding: "1em" }}>
                <Button variant="contained" color="primary" onClick={mainPage}>
                    <FormattedMessage id="mainPageButton" defaultMessage="Main Page" />
                </Button>
            </div>
            <Container maxWidth="md" style={{ paddingTop: "2em" }}>
                <Typography variant="h4" color="primary" align="center">
                    <FormattedMessage id="myPostsTitle" defaultMessage="My Reviews" />
                </Typography>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        <FormattedMessage id="sortLabel" defaultMessage="SORT BY" />
                    </InputLabel>
                    <Select 
                        value={sortOption} 
                        onChange={handleSortChange} 
                        label="Sort By" 
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                    >
                        <MenuItem value="date">
                            <FormattedMessage id="dateSortLabel" defaultMessage="Date" />
                        </MenuItem>
                        <MenuItem value="likes">
                            <FormattedMessage id="likesSortLabel" defaultMessage="Likes" />
                        </MenuItem>
                        <MenuItem value="rating">
                            <FormattedMessage id="ratingSortLabel" defaultMessage="Rating" />
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        <FormattedMessage id="filterLabel" defaultMessage="FILTER BY" />
                    </InputLabel>
                    <Select 
                        value={filterOption} 
                        onChange={handleFilterChange} 
                        label="Filter by"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                    >
                        <MenuItem value="rating1">
                            <FormattedMessage id="ratingFilterLabel" defaultMessage="Rating from" /> 1
                        </MenuItem>
                        <MenuItem value="rating2">
                            <FormattedMessage id="ratingFilterLabel" defaultMessage="Rating from" /> 2
                        </MenuItem>
                        <MenuItem value="rating3">
                            <FormattedMessage id="ratingFilterLabel" defaultMessage="Rating from" /> 3
                        </MenuItem>
                        <MenuItem value="rating4">
                            <FormattedMessage id="ratingFilterLabel" defaultMessage="Rating from" /> 4
                        </MenuItem>
                        <MenuItem value="rating5">
                            <FormattedMessage id="ratingFilterLabel" defaultMessage="Rating from" /> 5
                        </MenuItem>
                        <MenuItem value="thisWeek">
                            <FormattedMessage id="thisWeekFilterLabel" defaultMessage="This week reviews" />
                        </MenuItem>
                        <MenuItem value="highlyRated">
                            <FormattedMessage id="thisWeekFilterLabel" defaultMessage="Authors highly rated reviews" />
                        </MenuItem>
                    </Select>
                </FormControl>
                {sortReviews(userReviews, sortOption, filterOption).map((review) => (
                <div key={review.review_id}>
                    <ReviewPost review={review} liked={review.liked} />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(review.review_id)}
                    >
                        <FormattedMessage id="deleteButton" defaultMessage="DELETE" />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateReview(review)}
                    >
                        <FormattedMessage id="editButton" defaultMessage="EDIT" />
                    </Button>
                </div>
                ))}
            </Container>
        </IntlProvider>
    );
};

export default UserPage;