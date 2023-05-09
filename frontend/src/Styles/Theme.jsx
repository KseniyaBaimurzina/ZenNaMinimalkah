import { createTheme } from '@material-ui/core';

export const lightTheme = createTheme({
    palette: {
        background: {
            default: '#ffffff',
            search: '#cccfff',
            tags: '#cccfff',
            menu: '#cccfff'
        },
        text: {
            primary: '#0a0f64'
        },
        primary: {
            main: '#0a0f64',
            contrastText: '#cccfff',
        },
        secondary: {
            main: '#b51261',
            contrastText: '#0a0f64',
        },
        date: {
            main: '#676879',
        },
        likes: {
            main: '#b61261',
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        type: 'dark',
        background: {
            default: '#000000',
            search: '#303576',
            tags: '#303576',
            menu: '#303576'
        },
        text: {
            primary: '#cccfff',
        },
        primary: {
            main: '#0a0f64',
            contrastText: '#cccfff',
        },
        secondary: {
            main: '#b51261',
            contrastText: '#0a0f64',
        },
        date: {
            main: '#676879',
        },
        likes: {
            main: '#b61261',
        },
    },
});

