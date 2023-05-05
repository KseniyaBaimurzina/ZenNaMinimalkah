import { useNavigate } from "react-router";
import Reviews from "./Reviews";
import { Button } from "@material-ui/core";
import { fetchToken } from "./Auth";
import { useState } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import Header from "./Header";
import Tags from "./TagCloud";

export default function MainPage(){
    const navigate = useNavigate();
    const role = fetchToken();
    const [language] = useState(localStorage.getItem("language"));

    const signOut = ()=> {
        localStorage.removeItem('temitope')
        navigate('/login')
    };

    const buttonText = fetchToken() ? "signOutButton" : "signInButton";
    const myReviewsButton = fetchToken() ? (
        <Button variant="contained" color="primary" onClick={() => navigate("/user/reviews")}>
            <FormattedMessage id="myPostsTitle" defaultMessage="My Reviews" />
        </Button>
    ) : null;

    const adminButton = role === 'admin' ? (
        <Button variant="contained" color="primary" onClick={() => navigate("/users-list")}>
            <FormattedMessage id="usersListTitle" defaultMessage="Users List" />
        </Button>
    ) : null;

    return(
        <IntlProvider locale={language} messages={require(`./Languages/${language}.json`)}>
            <Header />
            <div style={{float: 'right', padding: '1em'}}>
                <Button variant="contained" color="secondary" onClick={signOut}>
                <FormattedMessage id={buttonText} />
                </Button>
            </div>
            <div style={{padding: '1em'}}>
                {myReviewsButton}
                {adminButton}
                <div style={{margin: '1em 0'}}>
                    <Tags />
                </div>
                <Reviews />
            </div>
        </IntlProvider>
    )
}
