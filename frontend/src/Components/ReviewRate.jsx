import api from "../axios";
import { useCallback } from "react";

const usePostRating = ({ review_id, rated }) => {

    const postRating = useCallback(async (rate) => {
        try {
            const res = await api.post("/rate/", {
                review_id: review_id,
                rate: rate,
                rated: rated
            });
            return res.data;
        } catch (err) {
            console.error(err);
        }
    }, [review_id, rated]);

    return { postRating };
};

export default usePostRating;
