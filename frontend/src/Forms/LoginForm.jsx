import { useNavigate } from "react-router-dom";
import { fetchToken, setToken } from "../Components/Auth";
import { useState } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import Header from "../Components/Header";
import api from "../axios";
import useStyles from "../Styles/AppStyles";
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Link,
    CircularProgress,
    Box
} from "@material-ui/core";

export default function Login() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [language] = useState(localStorage.getItem("language") || "en-US");

    const registration = () => {
        localStorage.removeItem("temitope");
        localStorage.removeItem("role")
        navigate("/registration");
    };

    if (fetchToken()) {
        navigate("/");
    }

    const loginCheck = () => {
        if (password === "" || username === "") {
            setErrorMessage("Please, fill in the input fields");
            return errorMessage;
        } else {
        setIsLoading(true);
        api.post("/login", { username: username, password: password })
            .then(function (response) {
            if (response.status === 200) {
                setToken(response.data.access_token, response.data.role);
                navigate("/");
            }
            })
            .catch(function (error) {
            if (error.response.status === 401) {
                setErrorMessage("Incorrect username or password. Please, try again");
            } else {
                setErrorMessage(error.response.data);
            }
            })
            .finally(() => setIsLoading(false));
        }
    };

    return (
        <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
            <Header />
            <Container component="main" maxWidth="xs" className={classes.signContainer}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5">
                        <FormattedMessage id="signInMessage" defaultMessage="Sign in and enjoy the service" />
                    </Typography>
                </Box>
                <Box
                    component="form"
                    noValidate
                    onSubmit={(e) => {
                    e.preventDefault();
                    loginCheck();
                    }}
                >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="username"
                            label={<FormattedMessage id="usernameLabel" defaultMessage="username" />}
                            name="Username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password"
                            label={<FormattedMessage id="passwordLabel" defaultMessage="password" />}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="signButton"
                        >
                        {
                            isLoading ? <CircularProgress size={24} /> : 
                            <FormattedMessage id="signInButton" defaultMessage="Sign In" />
                        }
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ display: "inline" }}>
                            <FormattedMessage id="signInQuestionMessage" defaultMessage="Don't have an account?" />
                        </Typography>{" "}
                        <Link className={classes.signLink} component="button" onClick={registration} >
                            <FormattedMessage id="signUpButton" defaultMessage="Sign Up" />
                        </Link>
                    </Grid>
                </Grid>
                </Box>
                {errorMessage && (
                    <Typography variant="body2" color="error">
                    {errorMessage}
                    </Typography>
                )}
            </Container>
        </IntlProvider>
    );
}