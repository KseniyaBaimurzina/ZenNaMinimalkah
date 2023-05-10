import { AppBar, Toolbar, Typography, TextField, Button, Switch, ThemeProvider } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from "react-intl";
import { fetchToken } from "./Auth";
import api from '../axios';
import LanguageSwitcher from './LanguageSwitch';
import { lightTheme, darkTheme } from '../Styles/Theme';
import useStyles from '../Styles/AppStyles';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [language] = useState(localStorage.getItem("language") || "en-US");
    const navigate = useNavigate();
    const role = fetchToken();
    const classes = useStyles();
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('isDarkMode') === 'true');

    const handleThemeChange = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('isDarkMode', !isDarkMode);
        window.location.reload();
    };

    const signOut = ()=> {
        localStorage.removeItem('temitope')
        navigate('/login')
    };

    const buttonText = fetchToken() ? "signOutButton" : "signInButton";
    
    const handleKeyPress = useCallback(
        async (e) => {
        if (e.key === 'Enter') {
            try {
                const res = await api.post('search', { query: searchQuery });
                navigate("/search-result", {state: {result: res.data, query: searchQuery}});
            } catch (error) {
                console.error(error);
            }
        }
    },[searchQuery, navigate]);

    const myReviewsButton = fetchToken() ? (
        <Button className={classes.headerButtons} variant="contained" color="primary" onClick={() => navigate("/user/reviews")}>
            <FormattedMessage id="myPostsTitle" defaultMessage="My Reviews" />
        </Button>
    ) : null;

    const adminButton = role === 'admin' ? (
        <Button className={classes.headerButtons} variant="contained" color="primary" onClick={() => navigate("/users-list")}>
            <FormattedMessage id="usersListTitle" defaultMessage="Users List" />
        </Button>
    ) : null;

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
                <AppBar position="sticky" >
                    <Toolbar>
                        <Typography variant="h6">
                            <FormattedMessage id="headerTitle" defaultMessage="PUMBA REVIEWS" />
                        </Typography>
                        {myReviewsButton}
                        {adminButton}
                        <TextField
                            className={classes.searchTextField}
                            variant='filled'
                            placeholder="SEARCH"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress} 
                            value={searchQuery}
                            inputProps={{
                                style: {
                                    height: "5px",
                                },}}
                        />
                        <Switch
                            checked={isDarkMode}
                            onChange={handleThemeChange}
                            color="secondary"
                        />
                        <LanguageSwitcher />
                        <Button className={classes.signHeaderButton} variant="contained" color="secondary" onClick={signOut}>
                            <FormattedMessage id={buttonText} />
                        </Button>
                    </Toolbar>
                </AppBar>
            </IntlProvider>
        </ThemeProvider>
    );
};

export default Header;