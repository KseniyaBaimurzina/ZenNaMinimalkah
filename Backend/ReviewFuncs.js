import Review from "./DBModels/review.js";
import jwt from "jsonwebtoken";
import * as db from "DBRequests.js";
import { GetRating } from "./RatingFuncs.js";

function CreateReview(access_token, review) {
    return new Promise(async(resolve, reject) => {
        try {
            var rev = review;
            rev["creator_username"] = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username;
            var newReview = new Review(rev),
                table = "Reviews",
                columns = Object.keys(rev),
                values = '"' + Object.values(rev).join('", "') + '"',
                res = await db.createQuery(table, columns, values);
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function UpdateReview(access_token, review) {
    return new Promise(async(resolve, reject) => {
        try {
            var rev = review;
            rev["creator_username"] = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username;
            var revToUpd = new Review(rev),
                table = "Reviews",
                checkCol = "review_id",
                checkValue = revToUpd.review_id;
            delete rev.review_id;
            var updCol = Object.keys(rev),
                updValue = Object.values(rev),
                res = await db.updateQuery(table, checkCol, updCol, checkValue, updValue);
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function DeleteReview(review) {
    return new Promise(async(resolve, reject) => {
        try {
            var table = "Reviews",
                column = "review_id",
                value = review.review_id,
                res = await db.deleteQuery(table, column, value);
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetPopularReviews() {
    return new Promise(async(resolve, reject) => {
        try {
            var likesRows = await db.getLikesRow(),
                reviewIds = likesRows.map(row => row.review_id);
            var reviews = await db.getPopularReviews(reviewIds),
                ratingPromises = reviews.map(obj => GetRating(obj.review_id));
            var ratings = await Promise.all(ratingPromises);
            reviews.forEach((obj, index) => {
                obj.users_rating = ratings[index];
                const likeRow = likesRows.find(row => row.review_id === obj.review_id);
                obj.like_count = likeRow ? likeRow.like_count : 0;
            });
            resolve(reviews);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetLatestReviews() {
    return new Promise(async(resolve, reject) => {
        try {
            var likesRows = await db.getLikesRow(),
                reviews = await db.getReviews();
            var ratingPromises = reviews.map(obj => GetRating(obj.review_id));
            var ratings = await Promise.all(ratingPromises);
            reviews.forEach((obj, index) => {
                obj.users_rating = ratings[index];
                const likeRow = likesRows.find(row => row.review_id === obj.review_id);
                obj.like_count = likeRow ? likeRow.like_count : 0;
            });
            resolve(reviews);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetUserReviews(access_token) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username,
                res = await db.getReviews(username);
            resolve(res);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetCategories() {
    return new Promise(async(resolve, reject) => {
        try {
            var table = "Categories",
                res = await db.getQuery(table),
                categories = res.map(obj => obj.category);
            console.log(categories)
            resolve(categories);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function searchIndex(query) {
    return new Promise((resolve, reject) => {
        client.search({
            index: 'reviews_2023-04-26',
            body: {
                query: {
                    match: {
                        field_name: query
                    }
                }
            }
        }).then((response) => {
            resolve(response.hits.hits.map((hit) => hit._source));
        }).catch((error) => {
            console.error(`Error searching index: ${error}`);
            reject(error);
        });
    });
}

export {
    CreateReview,
    UpdateReview,
    DeleteReview,
    GetPopularReviews,
    GetLatestReviews,
    GetUserReviews,
    GetCategories,
    searchIndex
}