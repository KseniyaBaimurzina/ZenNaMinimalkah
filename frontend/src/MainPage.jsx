import { useNavigate } from "react-router";
import Reviews from "./Reviews";
import { Button } from "@material-ui/core";
import { RequireToken, fetchToken } from "./Auth";
import Header from "./Header";
import Tags from "./TagCloud";

export default function MainPage(){
    const navigate = useNavigate();
    const signOut = ()=> {
        localStorage.removeItem('temitope')
        navigate('/login')
    };

    const buttonText = fetchToken() ? "Sign Out" : "Sign In";

    return(
        <div>
            <Header />
            <div style={{float: 'right', padding: '1em'}}>
                <Button variant="contained" color="secondary" onClick={signOut}>{buttonText}</Button>
            </div>
            <div style={{padding: '1em'}}>
                <RequireToken>
                    <Button variant="contained" color="primary" onClick={() => navigate("/user/reviews")}>My Reviews</Button>
                </RequireToken>
                <div style={{margin: '1em 0'}}>
                    <Tags />
                </div>
                <Reviews />
            </div>
        </div>
    )
}
