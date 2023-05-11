import * as db from "../DBRequests.js";
import * as dotenv from "dotenv";

const config = dotenv.config(".env").parsed;

function GetRating(review_id) {
    return new Promise(async(resolve, reject) => {
        try {
            var res = await db.getQuery(
                table = "Ratings",
                column = "review_id",
                value = review_id
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
                table = "Ratings",
                column = "creator_username",
                value = "'" + username + "'"
            );
            var reviewIds = res.map(row => row.review_id);
            resolve(reviewIds);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function CreateRate(rate, review_id, username, rated) {
    return new Promise(async(resolve, reject) => {
        try {
            if (rated) {
                await db.updateQuery("Ratings", "(creator_username, review_id)", `(${username}, '${review_id}')`, "rate", rate, )
            } else {
                await db.createQuery(
                    table = "Ratings",
                    columns = ["review_id", "creator_username", "rate"],
                    values = [review_id, "'" + username + "'", rate]
                );
            }
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
                    table = "Likes",
                    columns = ["review_id", "creator_username"],
                    values = [review_id, "'" + username + "'"]
                ) :
                await db.deleteLikeQuery(
                    table = "Likes",
                    columns = ["review_id", "creator_username"],
                    values = [review_id, "'" + username + "'"]
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
                table = "Likes",
                column = "creator_username",
                value = "'" + username + "'"
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