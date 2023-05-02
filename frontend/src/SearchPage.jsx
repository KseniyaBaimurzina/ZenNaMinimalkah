import Header from "./Header";
import { Box, Typography, Button } from '@material-ui/core';
import ReviewPost from "./ReviewPost";
import { useLocation, useNavigate } from 'react-router-dom';

import React from 'react';

const SearchResult = () => {
    const location = useLocation();
    const { result, query } = location.state;
    const navigate = useNavigate();
    
    const mainPage = () => {
        navigate("/")
    }

    return (
        <div>
            <Header />
            <div style={{float: 'right', padding: '1em'}}>
                <Button variant="contained" color="primary" onClick={mainPage}>Main Page</Button>
            </div>
            <Box textAlign="center" mt={8}>
                {result.length ? (
                    <>
                    <Typography variant="h4" gutterBottom>
                        Search Results for "{query}"
                    </Typography>
                    {result.map((review) => (
                        <ReviewPost key={review.review_id} review={review} />
                    ))}
                    </>
                ) : (
                    <Typography variant="h4">
                        No results, matching "{query}"
                    </Typography>
                )}
            </Box>
        </div>
    );
};
    
export default SearchResult;