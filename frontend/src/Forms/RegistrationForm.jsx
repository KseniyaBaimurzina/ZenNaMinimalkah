import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router"
import api from '../axios';
import Header from '../Components/Header';
import { IntlProvider, FormattedMessage } from "react-intl";
import { Container, Typography, Box, TextField, Button, Link } from '@material-ui/core';
import useStyles from '../Styles/AppStyles';

export default function RegistrationForm() {
    const navigate = useNavigate();
    const classes = useStyles();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState("");
    const [language] = useState(localStorage.getItem("language") || "en-US");

    const handleLoginClick = () => {
        localStorage.removeItem('temitope');
        navigate('/login');
    };

    const onSubmit = data => {
        api.post("/registration", { username: data.username, email: data.email, password: data.password })
        .then(res => {
            if (res.data === "OK") {
                alert("Success")
                navigate("/login");
            }
        })
        .catch(function (error) {
            console.log(error, 'error');
            setErrorMessage(`Email "${data.email}" already exists, please choose another one.`)
        });
    }

    return (
        <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
            <Header />
            <Container component="main" maxWidth="xs" className={classes.signContainer}>
                <Box minHeight={940} marginTop={2}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography variant="h5">
                            <FormattedMessage id="signUpMessage" defaultMessage="Sign up and enjoy the service" />
                        </Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="username"
                            label={<FormattedMessage id="usernameLabel" defaultMessage="username" />}
                            name="username"
                            autoComplete="username"
                            autoFocus
                            {...register("username", { required: true, minLength: 3 })}
                            error={Boolean(errors.username)}
                            helperText={
                            errors.username?.type === "required"
                                ? <FormattedMessage id="usernameRequireMessage" />
                                : errors.username?.type === "minLength"
                                ? <FormattedMessage id="usernameLengthMessage" />
                                : null
                            }
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="email"
                            label={<FormattedMessage id="emailLabel" defaultMessage="email" />}
                            name="email"
                            autoComplete="email"
                            {...register("email", { required: true, minLength: 5 })}
                            error={Boolean(errors.email)}
                            helperText={
                            errors.email?.type === "minLength"
                                ? <FormattedMessage id="emailLengthMessage"/>
                                : null
                            }
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password"
                            label={<FormattedMessage id="passwordLabel" defaultMessage="password" />}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            {...register("password", { required: true, minLength: 3 })}
                            error={Boolean(errors.password)}
                            helperText={
                            errors.password?.type === "minLength"
                                ? <FormattedMessage id="passwordLengthMessage"/>
                                : null
                            }
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="signButton"
                        >
                            <FormattedMessage id="signUpButton" defaultMessage="Sign Up" />
                        </Button>
                        <Box mt={2}>
                            {errorMessage && (
                            <Typography variant="body2" color="error">
                                {errorMessage}
                            </Typography>
                            )}
                        </Box>
                        <Typography variant="body1" sx={{ display: "inline" }}>
                        <FormattedMessage id="signUpQuestionMessage" defaultMessage="Already have an account?" />{" "}
                        </Typography>
                        <Link component="button" onClick={handleLoginClick}>
                            <FormattedMessage id="signInButton" defaultMessage="Sign In" />
                        </Link>
                    </form>
                </Box>
            </Container>
        </IntlProvider>
    )
}