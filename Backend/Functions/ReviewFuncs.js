import Review from "../DBModels/review.js";
import * as db from "../DBRequests.js";
import { Client } from '@elastic/elasticsearch';
import * as dotenv from "dotenv";

const config = dotenv.config(".env").parsed;

const client = new Client({ node: config["ELASTICSEARCH_SERVER"] });

function CreateReview(user, review) {
    return new Promise(async(resolve, reject) => {
        try {
            var rev = review.review;
            if (user.role === "user") {
                rev["creator_username"] = user.username;
            } else {
                rev["creator_username"] = review.username;
            }
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

function UpdateReview(review) {
    return new Promise(async(resolve, reject) => {
        try {
            var rev = review.review;
            if (review.tags) {
                var tags = review.tags.map(tag => `('${tag}')`).join(",");
                await db.createTagsQuery(tags);
                tags = review.tags.map(tag => `('${review.review.review_id}', '${tag}')`).join(',');
                await db.deleteQuery("ReviewTags", "review_id", review.review.review_id);
                await db.createRevTagsQuery("ReviewTags", "review_id, tag", tags);
            }
            var revToUpd = new Review(rev),
                colsVals = Object.entries(rev).map(([key, value]) => `${key} = '${value}'`).join(', ')
            await db.updateQuery("Reviews", "review_id", revToUpd.review_id, colsVals);
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
            var res = await db.deleteQuery(
                table = "Reviews",
                column = "review_id",
                value = review.review_id
            );
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
        console.error(error);
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

function GetUserReviews(username) {
    return new Promise(async(resolve, reject) => {
        try {
            var reviews = await db.getReviews(username);
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
            var res = await db.getQuery("Categories"),
                categories = res.map(obj => obj.category);
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