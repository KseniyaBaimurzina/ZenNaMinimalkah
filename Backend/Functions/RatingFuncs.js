import * as db from "../DBRequests.js";
import * as dotenv from "dotenv";

const config = dotenv.config(".env").parsed;

function GetRating(review_id) {
    return new Promise(async(resolve, reject) => {
        try {
            var res = await db.getQuery(
                "Ratings",
                "review_id",
                review_id
            );
            var averageRating = res.reduce((acc, curr) => acc + curr.rate, 0) / res.length;
            resolve(averageRating);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetUsersRate(username) {
    return new Promise(async(resolve, reject) => {
        try {
            var res = await db.getQuery(
                "Ratings",
                "creator_username",
                "'" + username + "'"
            );
            var reviewIds = res.map(row => row.review_id);
            resolve(reviewIds);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function CreateRate(rate, review_id, username) {
    return new Promise(async(resolve, reject) => {
        try {
            await db.updateCreateQuery(
                "Ratings", ["review_id", "creator_username", "rate"], [review_id, "'" + username + "'", rate], "rate", rate
            );
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function CreateLike(review_id, is_liked, username) {
    return new Promise(async(resolve, reject) => {
        try {
            var res = is_liked ?
                await db.createQuery(
                    "Likes", ["review_id", "creator_username"], [review_id, "'" + username + "'"]
                ) :
                await db.deleteLikeQuery(
                    "Likes", ["review_id", "creator_username"], [review_id, "'" + username + "'"]
                );
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetUsersLikes(username) {
    return new Promise(async(resolve, reject) => {
        try {
            var res = await db.getQuery(
                "Likes",
                "creator_username",
                "'" + username + "'"
            );
            var reviewIds = res.map(row => row.review_id);
            resolve(reviewIds);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

export {
    GetRating,
    GetUsersRate,
    CreateRate,
    CreateLike,
    GetUsersLikes,
}