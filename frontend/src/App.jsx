import {Routes, BrowserRouter, Route, Navigate, useLocation} from 'react-router-dom';
import Login from './Forms/LoginForm';
import MainPage from './MainPage';
import RegisterForm from './Forms/RegistrationForm';
import { useState, useEffect } from 'react';
import UserPage from './UserPage';
import ReviewPage from './PostReviewPage';
import SearchResult from './SearchPage';

function App() {
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // useEffect(() => {
    //     const authToken = localStorage.getItem("auth_token");
    //     if (authToken) {
    //         setIsAuthenticated(true);
    //     }
    // }, []);
  
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user/reviews" element={<UserPage />} />
                    <Route path="/search-result" element={<SearchResult />} />
                    <Route path="/create-review" element={<ReviewPage />} />
                    <Route path="/registration" element={<RegisterForm />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
  }
  
export default App;
