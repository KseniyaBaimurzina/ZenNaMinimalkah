import { useState, useCallback, useEffect } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    IconButton
} from "@material-ui/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AdminPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [language] = useState(localStorage.getItem("language") || "en-US");

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
        <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>
            <Box mt={4} sx={{ display: 'flex', justifyContent: 'center'}}>
                <Typography variant="h5" align="center" color="secondary" gutterBottom>
                    <FormattedMessage id="usersListTitle" defaultMessage="Users List" />
                </Typography>
                <List>
                    {users.map((user) => (
                    <ListItem key={user.id} button onClick={() => handleUserClick(user.username)}>
                        <ListItemText primary={user.username} align="center" />
                    </ListItem>
                    ))}
                </List>
            </Box>
        </IntlProvider>
    )
}

export default AdminPage;