import Header from "./Components/Header";
import { Box, Typography, Button } from '@material-ui/core';
import ReviewPost from "./Components/ReviewPost";
import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from "react-intl";

import React from 'react';

const SearchResult = () => {
    const location = useLocation();
    const { result, query } = location.state;
    const navigate = useNavigate();
    const [language] = useState(localStorage.getItem("language") || "en-US");
    
    const mainPage = () => {
        navigate("/")
    }

    return (
        <IntlProvider locale={language} messages={require(`./Languages/${language}.json`)}>
            <Header />
            <div style={{float: 'right', padding: '1em'}}>
                <Button variant="contained" color="primary" onClick={mainPage}>Main Page</Button>
            </div>
            <Box textAlign="center" mt={8}>
                {result.length ? (
                    <>
                    <Typography variant="h4" gutterBottom>
                        <FormattedMessage id="searchResultMessage" defaultMessage="Search Results for" /> "{query}"
                    </Typography>
                    {result.map((review) => (
                        <ReviewPost key={review.review_id} review={review} />
                    ))}
                    </>
                ) : (
                    <Typography variant="h4">
                        <FormattedMessage id="absentSearchResultMessage" defaultMessage="No results, matching" /> "{query}"
                    </Typography>
                )}
            </Box>
        </IntlProvider>
    );
};
    
export default SearchResult;