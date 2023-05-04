import React, { useState } from "react";
import { TextField, Typography } from "@material-ui/core";
import ReactMarkdown from "react-markdown";

const MarkdownInput = ({ value, onChange }) => {
    const [markdownSrc, setMarkdownSrc] = useState(value);

    const handleChange = (event) => {
        const newMarkdownSrc = event.target.value;
        setMarkdownSrc(newMarkdownSrc);
        onChange(newMarkdownSrc);
    };

    return (
        <>
        <TextField
            fullWidth
            margin="normal"
            id="content"
            label="Content"
            multiline
            minRows={4}
            value={markdownSrc}
            onChange={handleChange}
        />
        <Typography variant="h6" color="primary">Review preview:</Typography>
        <ReactMarkdown>{markdownSrc}</ReactMarkdown>
        </>
    );
};

export default MarkdownInput;