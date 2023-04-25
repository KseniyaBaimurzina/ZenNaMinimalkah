import React, { useState, useEffect, useCallback } from "react";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Container,
} from "@material-ui/core";
import api from "./axios";

const ReviewPage = () => {
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [productName, setProductName] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState("");

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

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    const handlePublish = useCallback(async () => {
        try {
            await api.post("/review", {
                title: title,
                category: category,
                product_name: productName,
                content: content,
                rate: rating,
            });
            setTitle("");
            setCategory("");
            setProductName("");
            setContent("");
            setRating("");
        } catch (err) {
            console.error(err);
        }
    }, [title, category, productName, content, rating]);

    return (
        <Container maxWidth="md">
        <Typography variant="h4">Write a Review</Typography>
        <form>
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
            <TextField
                required
                fullWidth
                margin="normal"
                id="content"
                label="Content"
                multiline
                minRows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
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
            <Button variant="contained" color="primary" onClick={handlePublish}>
                Publish
            </Button>
        </form>
        </Container>
    );
};

export default ReviewPage;