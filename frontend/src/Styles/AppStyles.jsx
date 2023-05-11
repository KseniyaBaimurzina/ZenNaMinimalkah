import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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
    formControl: {
        marginBottom: "5px"
    },
    reviewPageContainer: {
        width: '66%',
        margin: 'auto',
        backgroundColor: "transparent",
        marginBottom: '5px'
    },
    tagPaper: {
        margin: '15px',
        border: "2px solid #0a0f64",
        backgroundColor: "transparent",
        padding: '1em'
    },
    signLink: {
        color: theme.palette.text.primary
    },
    signContainer: {
        marginTop:'15px'
    },
    deleteButton: {
        display: "flex", 
        marginBottom: "5px"
    },
    userPageReview: {
        display: 'flex', 
        justifyContent: 'space-between'
    },
    cardHeader: {
        display: 'flex', 
        justifyContent: 'flex-start'
    },
    cardButtons: {
        display: 'flex', 
        justifyContent: 'flex-end',
        marginTop: '15px', 
        marginRight: '5px' 
    },
    clickable: {
        cursor: 'pointer'
    },
    homeHeadings: {
        marginLeft: '15px'
    },
    createReviewButton: {
        float: 'right', 
        padding: '1em'
    },
    homePageButton: {
        float: 'left', 
        padding: '1em'
    }
}));


export default useStyles;