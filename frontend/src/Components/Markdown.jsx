import React, { useState } from "react";
import { TextField, Typography } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import { IntlProvider, FormattedMessage } from "react-intl";

const Markdown = ({ value, onChange }) => {
    const [markdownSrc, setMarkdownSrc] = useState(value);
    const [language] = useState(localStorage.getItem("language") || "en")

    const handleChange = (event) => {
        const newMarkdownSrc = event.target.value;
        setMarkdownSrc(newMarkdownSrc);
        onChange(newMarkdownSrc);
    };

    return (
        <IntlProvider locale={language} messages={require(`../Languages/${language}.json`)}>
            <TextField
                fullWidth
                margin="normal"
                id="content"
                label={<FormattedMessage id="contentLabel" defaultMessage="Content" />}
                multiline
                minRows={4}
                value={markdownSrc}
                onChange={handleChange}
            />
            <Typography variant="h6">
                <FormattedMessage id="previewTitle" defaultMessage="Review Preview" />:
            </Typography>
            <ReactMarkdown>{markdownSrc}</ReactMarkdown>
        </IntlProvider>
    );
};

export default Markdown;