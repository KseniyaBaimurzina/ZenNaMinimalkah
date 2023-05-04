import { useState, useCallback, useEffect } from "react";
import api from "./axios";
import { useNavigate } from "react-router-dom";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@material-ui/core";

const AdminPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const getUsers = useCallback(async() => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err)
        };
    }, []);

    const handleUserClick = useCallback((username) => {
        navigate("/user/reviews", { state: { username: username}});
    }, [navigate]);

    useEffect(() => {
        getUsers();
        const interval = setInterval(() => {
            getUsers();
        }, 3000);
        return () => clearInterval(interval);
    }, [getUsers]);

    return (
        <Box mt={4}>
            <Typography variant="h5" align="centered" color="primary" gutterBottom>
                Users List
            </Typography>
            <List>
                {users.map((user) => (
                <ListItem key={user.id} button onClick={() => handleUserClick(user.username)}>
                    <ListItemText primary={user.username} />
                </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default AdminPage;