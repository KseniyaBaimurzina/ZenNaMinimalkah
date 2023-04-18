import api from "./axios";
import React, { useState, useEffect, useCallback } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";


const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    const getReviews = useCallback(async () => {
        try {
            const res = await api.get("/reviews");
            setReviews(res.data)
        } catch (err) {
            console.error(err)
        };
    }, []);

    useEffect(() => {
        getReviews();
        const interval = setInterval(() => {
            getReviews();
        }, 3000);
        return () => clearInterval(interval);
    }, [getReviews]);

    return (
        <Table>
            <TableHead>

            </TableHead>
            <TableBody>
                {
                    reviews.map((obj, idx) => (
                        <TableRow key={idx}>
                            {Object.values(obj).map((val, idx2) => (
                                <TableCell key={idx2}>{val}</TableCell>
                            ))}
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    )
}

export default Reviews;