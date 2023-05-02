import { AppBar, Toolbar, Typography, TextField } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from './axios';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

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

    return (
        <AppBar position="sticky" style={{ margin: 0 }}>
        <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
                PumbaReviews
            </Typography>
            <TextField
                variant="outlined"
                size="small"
                placeholder="Search"
                style={{ marginLeft: 'auto' }}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress} 
                value={searchQuery}
            />
        </Toolbar>
        </AppBar>
    );
};

export default Header;