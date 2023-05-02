import api from "./axios";
import { useState, useCallback, useEffect } from "react";
import { Chip, Paper, Typography } from '@material-ui/core';

const Tags = () => {
    const [tags, setTags] = useState([]);

    const getTags = useCallback(async() => {
        try {
            const res = await api.get("/tags");
            setTags(res.data);
            
        } catch (err) {
            console.error(err)
        };
    }, []);

    console.log(tags);

    useEffect(() => {
        getTags();
        const interval = setInterval(() => {
            getTags();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    return ( 
        <div>
            <Typography variant="h6">Tags:</Typography>
            <Paper style={{ padding: '1em', margin: '1em' }}>
                {tags.map((tag, index) => (
                    <Chip key={index} label={tag.tag} style={{ margin: '0.5em' }} />
                ))}
            </Paper>
        </div>
    );
}

export default Tags;