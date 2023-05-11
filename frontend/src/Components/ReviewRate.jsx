import api from "../axios";
import { useCallback, useState } from "react";

const usePostRating = ({ review_id, rated }) => {
    const [isRated, setIsRated] = useState(false);

    const postRating = useCallback(async (rate) => {
        try {
            console.log(review_id)
            const res = await api.post("/rate/", {
                review_id: review_id,
                rate: rate,
                rated: rated
            });
            setIsRated(true);
            return res.data;
        } catch (err) {
            console.error(err);
        }
    }, [review_id, rated]);

    return { isRated, postRating };
};

export default usePostRating;
