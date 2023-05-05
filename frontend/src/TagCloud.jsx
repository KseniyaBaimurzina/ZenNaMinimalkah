import api from "./axios";
import { useState, useCallback, useEffect } from "react";
import { Chip, Paper, Typography } from '@material-ui/core';
import { useNavigate } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";

const Tags = () => {
    const [tags, setTags] = useState([]);
    const [language] = useState(localStorage.getItem("language"));
    const navigate = useNavigate();

    const getTags = useCallback(async() => {
        try {
            const res = await api.get("/tags");
            setTags(res.data);
            
        } catch (err) {
            console.error(err)
        };
    }, []);

    const searchTag = useCallback(async(searchTag) =>{
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
    }, []);

    return ( 
        <IntlProvider locale={language} messages={require(`./Languages/${language}.json`)}>
            <Paper style={{ padding: '1em' }}>
                <Typography variant="h6"><FormattedMessage id="tagsLabel" defaultMessage="Tags" />:</Typography>
                {tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={tag.tag}
                        onClick={() => searchTag(tag.tag)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
            </Paper>
        </IntlProvider>
    );
}

export default Tags;