import React, { useCallback, useEffect, useState } from "react";
import { Container, Button, MenuItem, Select, FormControl, InputLabel } from "@material-ui/core";
import ReviewPost from "../Components/ReviewPost";
import api from "../axios";
import { useNavigate, useLocation } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";
import Header from "../Components/Header";
import useStyles from "../Styles/AppStyles";
import { ThemeProvider } from '@material-ui/styles';
import { darkTheme, lightTheme } from "../Styles/Theme";

const UserPage = () => {
    const classes = useStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username || null;
    const [userReviews, setUserReviews] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const [filterOption, setFilterOption] = useState("");
    const [userLikes, setUserLikes] = useState([]);
    const [language] = useState(localStorage.getItem("language") || "en-US");
    const theme = localStorage.getItem("isDarkMode") === 'true' ? darkTheme : lightTheme;

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };

    const handleCreateReview = () => {
        navigate("/create-review", {state: {username: username}});
    };

    const mainPage = () => {
        navigate("/");
    }

    const getUserReviews = useCallback(async () => {
        try {
            const res = await api.get(`/user/reviews?username=${username}`);
            setUserReviews(res.data.userReviews);
            setUserLikes(res.data.userLikes);
        } catch (err) {
            console.error(err);
        }
    }, [username]);

    

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
                filteredReviews = filteredReviews.filter((review) => new Date(review.creation_time) >= weekAgo);
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
        <ThemeProvider theme={theme}>
        <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
            <Header />
            <div className={classes.createReviewButton}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateReview}
                >
                    <FormattedMessage id="createReviewButton" defaultMessage="Create Review" />
                </Button>
            </div>
            <div className={classes.homePageButton}>
                <Button variant="contained" color="primary" onClick={mainPage}>
                    <FormattedMessage id="mainPageButton" defaultMessage="Main Page" />
                </Button>
            </div>
            <Container maxWidth="md" >
                <Container>
                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                        <FormattedMessage id="sortLabel" defaultMessage="SORT BY" />
                    </InputLabel>
                    <Select 
                        value={sortOption} 
                        onChange={handleSortChange}
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
                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                        <FormattedMessage id="filterLabel" defaultMessage="FILTER BY" />
                    </InputLabel>
                    <Select
                        value={filterOption} 
                        onChange={handleFilterChange} 
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
                            <FormattedMessage id="authorRatedFilterLabel" defaultMessage="Authors highly rated reviews" />
                        </MenuItem>
                    </Select>
                </FormControl>
                </Container>
                {sortReviews(userReviews, sortOption, filterOption).map((review) => (
                <div key={review.review_id} >
                    <ReviewPost review={review} liked={review.liked} username={username} rated={review.rated} userLikes={userLikes}/>
                </div>
                ))}
            </Container>
        </IntlProvider>
        </ThemeProvider>
    );
};

export default UserPage;