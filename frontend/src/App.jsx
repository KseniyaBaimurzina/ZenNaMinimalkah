import {Routes, BrowserRouter, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { IntlProvider } from 'react-intl';
import { lightTheme, darkTheme } from './Styles/Theme';
import { LoginForm, RegistrationForm} from './Forms'
import { MainPage, AdminPage, ReviewCreateUpdatePage, ReviewPage, SearchPage, UserPage } from './Pages'

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
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/user/reviews" element={<UserPage />} />
                            <Route path="/search-result" element={<SearchPage />} />
                            <Route path="/create-review" element={<ReviewCreateUpdatePage />} />
                            <Route path="/registration" element={<RegistrationForm />} />
                        </Routes>
                    </BrowserRouter>
            </IntlProvider>
        </ThemeProvider>
    );
  }
  
export default App;
