import { Button, Menu, MenuItem } from "@material-ui/core";
import React, { useState } from "react";
import useStyles from "../Styles/AppStyles";

const LanguageSwitch = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const languages = [
        { code: "en-US", name: "EN" },
        { code: "zh-CN", name: "中文" },
    ];
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") === "en-US" ? "EN" : "中文")
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleLanguageChange = (languageCode, languageName) => {
        localStorage.setItem("language", languageCode);
        setSelectedLanguage(languageName);
        handleClose();
        window.location.reload();
    };

    return (
        <div>
            <Button className={classes.languageButton} onClick={handleClick}>{selectedLanguage}</Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {languages.map((language) => (
                <MenuItem
                    className={classes.menuItem}
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code, language.name)}
                >
                    {language.name}
                </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default LanguageSwitch;