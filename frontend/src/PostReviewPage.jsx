import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import { IntlProvider, FormattedMessage } from "react-intl";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Container,
    IconButton
} from "@material-ui/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MarkdownInput from "./Markdown";
import api from "./axios";

const ReviewCreateUpdatePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [language] = useState(localStorage.getItem("language") || "en-US");
    const review = location.state?.review;
    const username = location.state.username;
    const [tags, setTags] = useState(review?.review_tags || []);
    const [tagsOptions, setTagsOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState(review?.title || "");
    const [category, setCategory] = useState(review?.category || "");
    const [productName, setProductName] = useState(review?.product_name || "");
    const [content, setContent] = useState(review?.content || "");
    const [rating, setRating] = useState(review?.rate || "");

    const getCategories = useCallback(async () => {
        try {
            const res = await api.get("/categories");
            setCategories(
                res.data.map((categoryName) => ({
                category_id: categoryName,
                category_name: categoryName,
                }))
            );
        } catch (err) {
            console.error(err);
        }
    }, []);

    const getTags = useCallback(async() => {
        try {
            const res = await api.get("/tags");
            setTagsOptions(res.data);
            
        } catch (err) {
            console.error(err)
        };
    }, []);

    useEffect(() => {
        getTags();
        getCategories();
    }, [getCategories, getTags]);

    const handleTagsChange = (event, value) => {
        const tagsValue = value.map((tag) =>
            typeof tag === 'object' ? tag.tag : tag
        );
        setTags(tagsValue);
      };

    const handlePublish = useCallback(async () => {
        try {
            await api.post("/review", { review: {
                title: title,
                category: category,
                product_name: productName,
                content: content,
                rate: rating,}, 
                tags: tags,
                username: username
            });
            console.log(tags)
            navigate(-1);
        } catch (err) {
            console.error(err);
        }
    }, [navigate, tags, username, title, category, productName, content, rating]);

    const handleUpd = useCallback(async () => {
        try {
            await api.put("/review", {review: {
                creator_username: review.creator_username,
                review_id: review.review_id,
                title: title,
                category: category,
                product_name: productName,
                content: content,
                rate: rating}, 
                tags: tags
            });
            setTitle("");
            setCategory("");
            setProductName("");
            setContent("");
            setRating("");
            setTags([]);
            navigate(-1)
        } catch (err) {
            console.error(err);
        }
    }, [navigate, title, category, productName, content, rating, tags]);

    return (
        <IntlProvider locale={language} messages={require(`./Languages/${language}.json`)}>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>
            <Container maxWidth="md"> 
                <form>
                <Autocomplete
                    multiple
                    options={tagsOptions}
                    getOptionLabel={(option) => option.tag}
                    filterSelectedOptions
                    onChange={handleTagsChange}
                    freeSolo
                    renderInput={(params) => (
                    <TextField {...params} 
                        variant="outlined" 
                        label={<FormattedMessage id="tagsLabel" defaultMessage="Tags" />} 
                        placeholder={<FormattedMessage id="tagsPlaceholder" defaultMessage="Add tags" />} 
                    />
                    )}
                />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="title"
                        label={<FormattedMessage id="titleLabel" defaultMessage="Review Title" />}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal" required>
                    <InputLabel id="category-label">
                        <FormattedMessage id="categoryLabel" defaultMessage="Category" />
                    </InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((category) => (
                            <MenuItem key={category.category_id} value={category.category_id}>
                                <FormattedMessage id={category.category_name} defaultMessage={category.category_name} />
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="product-name"
                        label={<FormattedMessage id="productNameLabel" defaultMessage="Product Name" />}
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    <MarkdownInput value={content} onChange={setContent} />
                    <FormControl fullWidth margin="normal" required>
                    <InputLabel id="rating-label">
                        <FormattedMessage id="rating" defaultMessage="Rating" />
                    </InputLabel>
                    <Select
                        labelId="rating-label"
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <MenuItem key={rating} value={rating}>
                            {rating}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={review===undefined ? handlePublish : handleUpd}>
                        <FormattedMessage id="publishButton" defaultMessage="Publish" />
                    </Button>
                </form>
            </Container>
        </IntlProvider>
    );
};

export default ReviewCreateUpdatePage;