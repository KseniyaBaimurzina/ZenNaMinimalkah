import {Routes, BrowserRouter, Route, Navigate} from 'react-router-dom';
import Login from './Forms/LoginForm';
import MainPage from './MainPage';
import RegisterForm from './Forms/RegistrationForm';
import { useState, useEffect } from 'react';
import UserPage from './UserPage';
import ReviewPage from './PostReviewPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem("auth_token");
        if (authToken) {
            setIsAuthenticated(true);
        }
    }, []);
  
    return (
        <div className ="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/reviews" />} />
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/reviews" element={<MainPage />} />
                    <Route path="/user/reviews" element={<UserPage />} />
                    <Route path="/create-review" element={<ReviewPage />} />
                    <Route path="/registration" element={<RegisterForm />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
  
export default App;
