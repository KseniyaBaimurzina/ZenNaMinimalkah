import { useNavigate } from "react-router";
import Reviews from "./Reviews";
import { Button } from "@material-ui/core";
import { RequireToken } from "./Auth";

export default function MainPage(){
    const navigate = useNavigate();
    const signOut = ()=> {
        localStorage.removeItem('temitope')
        navigate('/login')
    };

    return(
        <div>
            <div style={{float: 'right', padding: '1em'}}>
                <Button variant="contained" color="secondary" onClick={signOut}>Sign Out</Button>
            </div>
            <div>
                <RequireToken>
                    <Button variant="contained" color="primary" onClick={() => navigate("/user/reviews")}>My Reviews</Button>
                </RequireToken>
                <Reviews />
            </div>
        </div>
    )
}