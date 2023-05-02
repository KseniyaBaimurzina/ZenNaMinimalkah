import Review from "./DBModels/review.js";
import jwt from "jsonwebtoken";
import * as db from "./DBRequests.js";
import { Client } from '@elastic/elasticsearch';
import * as dotenv from "dotenv";

const config = dotenv.config(".env").parsed;

const client = new Client({ node: config["ELASTICSEARCH_SERVER"] });

function CreateReview(access_token, user, review) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username;
            var rev = review.review;
            rev["creator_username"] = user.role === "admin" ? review.review.creator_username : username;
            var newReview = new Review(rev),
                res = await db.createQuery("Reviews", Object.keys(rev), '"' + Object.values(rev).join('", "') + '"');
            if (review.tags) {
                var tags = review.tags.map(tag => `('${tag}')`).join(",");
                await db.createTagsQuery(tags);
                tags = review.tags.map(tag => `('${res.insertId}', '${tag}')`).join(',');
                await db.createRevTagsQuery("ReviewTags", "review_id, tag", tags);
            }
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function UpdateReview(access_token, user, review) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username;
            if (user.role === "admin" || user.username === username) {
                var rev = review;
                if (review.tags) {
                    var tags = review.tags.map(tag => `('${tag}')`).join(",");
                    await db.createTagsQuery(tags);
                    tags = review.tags.map(tag => `('${review.review_id}', '${tag}')`).join(',');
                    await db.deleteQuery("ReviewTags", "review_id", review.review_id);
                    await db.createRevTagsQuery("ReviewTags", "review_id, tag", tags);
                }
                delete rev.tags;
                var revToUpd = new Review(rev);
                await db.updateQuery("Reviews", "review_id", Object.keys(rev), revToUpd.review_id, Object.values(rev));
                resolve(true);
            } else {
                reject(false);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function DeleteReview(access_token, user, review) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username;
            if (user.role === "admin" || user.username === username) {
                var table = "Reviews",
                    column = "review_id",
                    value = review.review_id,
                    res = await db.deleteQuery(table, column, value);
                resolve(true);
            } else {
                reject(false);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetPopularReviews() {
    return new Promise(async(resolve, reject) => {
        try {
            var reviews = await db.getPopularReviews();
            var reviewsWithTags = GetReviewTags(reviews);
            resolve(reviewsWithTags);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

async function GetReviewTags(reviews) {
    try {
        var tags = await GetTags("ReviewTags");
        reviews.forEach((review) => {
            const foundTags = tags.filter((tag) => tag.review_id === review.review_id);
            review.review_tags = [];
            foundTags.forEach((foundTag) => {
                review.review_tags.push(foundTag.tag);
            });
        });
        return reviews;
    } catch (error) {
        throw new Error(error);
    }
}

function GetLatestReviews() {
    return new Promise(async(resolve, reject) => {
        try {
            var reviews = await db.getReviews();
            var reviewsWithTags = GetReviewTags(reviews);
            resolve(reviewsWithTags);
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
                reviews = await db.getReviews(username);
            var reviewsWithTags = GetReviewTags(reviews);
            resolve(reviewsWithTags);
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

function GetTags(table) {
    return new Promise(async(resolve, reject) => {
        try {
            var res = await db.getQuery(table);
            resolve(res);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function SearchIndex(query) {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await client.search({
                index: 'reviews_2023-04-26',
                body: {
                    query: {
                        multi_match: {
                            query: query,
                            fields: ['content', 'creator_username', 'title', 'product_name', 'comments.text', 'tags.tag']
                        }
                    },
                },
            });
            var data = await client.search({
                index: 'reviews_2023-04-26',
                body: {
                    query: {
                        match_all: {}
                    }
                },
            });
            console.log(data.hits.hits.map((hit) => hit._source));
            resolve(result.hits.hits.map((hit) => hit._source));
        } catch (error) {
            reject(error);
        }
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
    SearchIndex,
    GetTags
}