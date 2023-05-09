import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    // components: {
    //     MuiChip: {
    //         styleOverrides: {
    //             root: {
    //                 backgroundColor: theme.palette.background.tags,
    //                 color: theme.palette.text.primary,
    //             }
    //         }
    //     }
    // },
    '@global': {
        body: {
            overflowX: 'hidden',
            scrollbarWidth: 'none', /* Для Firefox */
            '-ms-overflow-style': 'none', /* Для IE и Edge */
            '&::-webkit-scrollbar': {
                display: 'none', /* Для Chrome, Safari, и Opera */
            },
        },
    },
    card: {
        marginLeft: '15px',
        marginRight: '15px',
        marginBottom: '5px',
        border: "2px solid #0a0f64",
        backgroundColor: "transparent"
    },
    headerButtons: {
        color: "#cccfff",
        border: "1px solid #cccfff",
        backgroundColor: "transparent",
        marginLeft: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
            backgroundColor: "transparent",
        },
        width: 200,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            maxWidth: 200,
        }
    },
    signHeaderButton: {
        float: 'right',
        color: "#b61261",
        border: "1px solid #b61261",
        backgroundColor: "transparent",
    },
    title: {
        flexGrow: 1,
        textAlign: 'center',
    },
    searchTextField: {
        backgroundColor: theme.palette.background.search,
        marginLeft: 'auto',
        borderRadius: '5px',
        width: 250,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            maxWidth: 250,
        },
    },
    // chipComponent: {
    //     backgroundColor: theme.palette.background.tags,
    //     color: theme.palette.text.primary,
    // },
    languageButton: {
        color: "#cccfff",
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: theme.palette.background.menu,
        },
    },
    menuItem: {
        color: theme.palette.text.primary,
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: theme.palette.background.menu,
        },
    },
    overrides: {
        MuiChip: {
            root: {
                backgroundColor: theme.palette.background.tags,
                color: theme.palette.text.primary
            }
        }
    }
}));


export default useStyles;