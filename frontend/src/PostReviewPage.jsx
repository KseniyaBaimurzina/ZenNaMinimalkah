import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Container,
} from "@material-ui/core";
import MarkdownInput from "./Markdown";
import api from "./axios";

const ReviewCreateUpdatePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const review = location.state?.review;
    const username = location.state.username;
    const review_id = review?.review_id;
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

    const goToMyPage = () => {
        navigate("/user/reviews")
    }

    const handleTagsChange = (event, value) => {
        console.log(JSON.stringify(value))
        const tagsValue = value.map((tag) =>
            typeof tag === 'object' ? tag.tag : tag
        );
        console.log(tagsValue)
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
            setTitle("");
            setCategory("");
            setProductName("");
            setContent("");
            setRating("");
            setTags([]);
            goToMyPage();
        } catch (err) {
            console.error(err);
        }
    }, [title, category, productName, content, rating]);

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
            goToMyPage()
        } catch (err) {
            console.error(err);
        }
    }, [review_id, title, category, productName, content, rating]);

    return (
        <div>
            <div style={{float: 'right', padding: '1em'}}>
                <Button variant="contained" color="primary" onClick={goToMyPage}>My Page</Button>
            </div>
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
                    <TextField {...params} variant="outlined" label="Tags" placeholder="Add tags" />
                    )}
                />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="title"
                        label="Review Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((category) => (
                            <MenuItem key={category.category_id} value={category.category_id}>
                                {category.category_name}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="product-name"
                        label="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    <MarkdownInput value={content} onChange={setContent} />
                    <FormControl fullWidth margin="normal" required>
                    <InputLabel id="rating-label">Rating</InputLabel>
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
                        Publish
                    </Button>
                </form>
            </Container>
        </div>
    );
};

export default ReviewCreateUpdatePage;