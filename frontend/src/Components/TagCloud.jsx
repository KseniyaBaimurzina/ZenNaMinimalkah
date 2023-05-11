import api from "../axios";
import { useState, useCallback, useEffect } from "react";
import { Chip, Paper, Typography } from '@material-ui/core';
import { useNavigate } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";
import { ThemeProvider } from '@material-ui/styles';
import { darkTheme, lightTheme } from "../Styles/Theme";
import useStyles from "../Styles/AppStyles";

const TagCloud = () => {
    const [tags, setTags] = useState([]);
    const [language] = useState(localStorage.getItem("language") || "en-US");
    const classes = useStyles();
    const navigate = useNavigate();
    const theme = localStorage.getItem("isDarkMode") === 'true' ? darkTheme : lightTheme;

    const getTags = useCallback(async() => {
        try {
            const res = await api.get("/tags");
            setTags(res.data);
        } catch (err) {
            console.error(err)
        };
    }, []);

    const searchTag = (async(searchTag) =>{
        try {
            const res = await api.post("/search", { query: searchTag });
            navigate("/search-result", {state: {result: res.data, query: searchTag}})
        } catch(error){
            console.error(error)
        }
    });

    useEffect(() => {
        getTags();
        const interval = setInterval(() => {
            getTags();
        }, 30000);
        return () => clearInterval(interval);
    }, [getTags]);

    return (
        <ThemeProvider theme={theme}>
            <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
                <Paper className={classes.tagPaper}>
                    <Typography variant="h6"><FormattedMessage id="tagsLabel" defaultMessage="Tags" />:</Typography>
                    {tags.map((tag, index) => (
                        <Chip
                            style={{backgroundColor: theme.palette.background.tags, color: theme.palette.text.primary, marginLeft: "5px"}}
                            key={index}
                            label={tag.tag}
                            onClick={() => searchTag(tag.tag)}
                            size="medium"
                        />
                    ))}
                </Paper>
            </IntlProvider>
        </ThemeProvider>
    );
}

export default TagCloud;