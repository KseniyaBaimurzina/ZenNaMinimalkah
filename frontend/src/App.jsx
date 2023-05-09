import {Routes, BrowserRouter, Route, Navigate, useLocation} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { IntlProvider } from 'react-intl';
import Login from './Forms/LoginForm';
import MainPage from './MainPage';
import RegisterForm from './Forms/RegistrationForm';
import { useState, useEffect } from 'react';
import UserPage from './UserPage';
import ReviewCreateUpdatePage from './PostReviewPage';
import SearchResult from './SearchPage';
import ReviewPage from './ReviewPage';
import AdminPage from './AdminPage';
import { lightTheme, darkTheme } from './Styles/Theme';
import useStyles from './Styles/AppStyles';

function App() {
    const theme = localStorage.getItem("isDarkMode") === 'true' ? darkTheme : lightTheme;
    const classes = useStyles();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // useEffect(() => {
    //     const authToken = localStorage.getItem("auth_token");
    //     if (authToken) {
    //         setIsAuthenticated(true);
    //     }
    // }, []);
  
    return (
        <ThemeProvider theme={theme}>
            <IntlProvider locale="en-US">
            <CssBaseline />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/review-page" element={<ReviewPage />} />
                            <Route path="/users-list" element={<AdminPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/user/reviews" element={<UserPage />} />
                            <Route path="/search-result" element={<SearchResult />} />
                            <Route path="/create-review" element={<ReviewCreateUpdatePage />} />
                            <Route path="/registration" element={<RegisterForm />} />
                        </Routes>
                    </BrowserRouter>
            </IntlProvider>
        </ThemeProvider>
    );
  }
  
export default App;
