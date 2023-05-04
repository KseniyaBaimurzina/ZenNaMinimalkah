import * as db from "./DBRequests.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

const config = dotenv.config(".env").parsed;

function GetRating(review_id) {
    return new Promise(async(resolve, reject) => {
        try {
            var table = "Ratings",
                column = "review_id",
                value = review_id,
                res = await db.getQuery(table, column, value);
            var averageRating = res.reduce((acc, curr) => acc + curr.rate, 0) / res.length;
            resolve(averageRating);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetUsersRate(access_token) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username,
                table = "Ratings",
                column = "creator_username",
                value = "'" + username + "'",
                res = await db.getQuery(table, column, value);
            var reviewIds = res.map(row => row.review_id);
            resolve(reviewIds);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function CreateRate(rate, review_id, access_token, rated) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = "'" + jwt.verify(access_token, config["SECRET_JWT_KEY"]).username + "'",
                table = "Ratings";
            if (rated) {
                await db.updateQuery(table, "(creator_username, review_id)", rate, "rate", `(${username}, '${review_id}')`)
            } else {
                var columns = ["review_id", "creator_username", "rate"],
                    values = [review_id, username, rate];
                await db.createQuery(table, columns, values);
            }
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function CreateLike(review_id, is_liked, access_token) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username,
                table = "Likes",
                columns = ["review_id", "creator_username"],
                values = [review_id, "'" + username + "'"],
                res = is_liked ? await db.createQuery(table, columns, values) : await db.deleteLikeQuery(table, columns, values);
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetUsersLikes(access_token) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username,
                table = "Likes",
                column = "creator_username",
                value = "'" + username + "'",
                res = await db.getQuery(table, column, value);
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