import { AppBar, Toolbar, Typography, TextField } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from "react-intl";
import api from './axios';
import LanguageSwitcher from './LanguageSwitch';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [language] = useState(localStorage.getItem("language") || "en-US");
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
        <IntlProvider locale={language} messages={require(`./Languages/${language}.json`)}>
            <AppBar position="sticky" style={{ margin: 0 }}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        <FormattedMessage id="headerTitle" defaultMessage="Pumba Reviews" />
                    </Typography>
                    <TextField
                        variant='filled'
                        size="small"
                        placeholder="search"
                        style={{ marginLeft: 'auto' }}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress} 
                        value={searchQuery}
                    />
                    <LanguageSwitcher />
                </Toolbar>
            </AppBar>
        </IntlProvider>
    );
};

export default Header;