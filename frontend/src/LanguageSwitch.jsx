import { useIntl } from "react-intl";
import { Button } from "@material-ui/core";
import React from "react";

const LanguageSwitcher = () => {
    const intl = useIntl();

    const handleLanguageChange = (languageCode) => {
        localStorage.setItem('language', languageCode)
        window.location.reload();
    };

    return (
        <div>
            <Button size="small" onClick={() => handleLanguageChange('en-US')}>EN</Button>
            <Button size="small" onClick={() => handleLanguageChange('zh-CN')}>中文</Button>
        </div>
    );
};

export default LanguageSwitcher;