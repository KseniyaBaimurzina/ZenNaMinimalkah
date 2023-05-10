import {Routes, BrowserRouter, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { IntlProvider } from 'react-intl';
import Login from './Forms/LoginForm';
import MainPage from './Pages/MainPage';
import RegisterForm from './Forms/RegistrationForm';
import UserPage from './Pages/UserPage';
import ReviewCreateUpdatePage from './Pages/PostReviewPage';
import SearchResult from './Pages/SearchPage';
import ReviewPage from './Pages/ReviewPage';
import AdminPage from './Pages/AdminPage';
import { lightTheme, darkTheme } from './Styles/Theme';

function App() {
    const theme = localStorage.getItem("isDarkMode") === 'true' ? darkTheme : lightTheme;

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
