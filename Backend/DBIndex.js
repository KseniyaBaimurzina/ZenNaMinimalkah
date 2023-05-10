import { Client } from '@elastic/elasticsearch';
import * as dotenv from 'dotenv';
import connection from './DBConnection.js';

const config = dotenv.config().parsed;
const client = new Client({ node: config["ELASTICSEARCH_SERVER"] });

async function checkIndexExists(indexName) {
    try {
        const result = await client.indices.exists({ index: indexName });
        return result;
    } catch (error) {
        console.error(`Error checking if index ${indexName} exists: ${error}`);
        throw error;
    }
}

async function createIndex(indexName) {
    try {
        await client.indices.create({
            index: indexName,
            body: {
                mappings: {
                    properties: {
                        review_id: { type: 'integer' },
                        creator_username: { type: 'text' },
                        category: { type: 'text' },
                        title: { type: 'text' },
                        product_name: { type: 'text' },
                        content: { type: 'text' },
                        rate: { type: 'integer' },
                        image_path: { type: 'text' },
                        creation_time: { type: 'date' },
                        comments: {
                            properties: {
                                comment_id: { type: 'integer' },
                                creator_username: { type: 'text' },
                                text: { type: 'text' },
                                creation_time: { type: 'date' }
                            }
                        },
                        review_tags: {
                            properties: {
                                tag: { type: 'text' },
                                review_id: { type: 'integer' }
                            }
                        }
                    }
                }
            }
        });
        console.log(`Index ${indexName} created successfully.`);
    } catch (error) {
        console.error(`An error occurred while creating index ${indexName}: ${error}`);
    }
}

async function updateIndex(indexName, data) {

    const body = [];

    data.reviews.forEach(review => {
        const commentIds = data.comments
            .filter(comment => comment.review_id === review.review_id)
            .map(comment => comment.comment_id);

        const tags = data.tags
            .filter(tag => tag.review_id === review.review_id)
            .map(tag => tag.tag);

        body.push({ update: { _index: indexName, _id: review.review_id } });
        body.push({
            doc: {
                review_id: review.review_id,
                creator_username: review.creator_username,
                category: review.category,
                title: review.title,
                product_name: review.product_name,
                content: review.content,
                rate: review.rate,
                image_path: review.image_path,
                creation_time: review.creation_time,
                comments: commentIds,
                review_tags: tags
            },
            upsert: {
                review_id: review.review_id,
                creator_username: review.creator_username,
                category: review.category,
                title: review.title,
                product_name: review.product_name,
                content: review.content,
                rate: review.rate,
                image_path: review.image_path,
                creation_time: review.creation_time,
                comments: commentIds,
                review_tags: tags
            }
        });
    });

    data.comments.forEach(comment => {
        const tags = data.tags
            .filter(tag => tag.review_id === comment.review_id)
            .map(tag => tag.tag);

        body.push({ update: { _index: indexName, _id: comment.comment_id } });
        body.push({
            doc: {
                creator_username: comment.creator_username,
                review_id: comment.review_id,
                text: comment.text,
                creation_time: comment.creation_time,
                review_tags: tags
            },
            upsert: {
                creator_username: comment.creator_username,
                review_id: comment.review_id,
                text: comment.text,
                creation_time: comment.creation_time,
                review_tags: tags
            }
        });
    });

    await client.bulk({ body });
    console.log(`Index ${indexName} successfully updated.`);
}

async function indexDB() {
    try {
        console.log("indexation started");
        const reviews = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Reviews', (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const comments = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Comments', (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const tags = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ReviewTags', (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        })

        const indexName = "reviews_2023-04-26";
        const indexExists = await checkIndexExists(indexName);
        const data = { reviews: reviews, comments: comments, tags: tags }

        if (indexExists) {
            updateIndex(indexName, data)
        } else {
            createIndex(indexName)
            const body = [];

            data.reviews.forEach(review => {
                const commentIds = data.comments
                    .filter(comment => comment.review_id === review.review_id)
                    .map(comment => comment.comment_id);

                body.push({ update: { _index: indexName, _id: review.review_id } });
                body.push({
                    doc: {
                        review_id: review.review_id,
                        creator_username: review.creator_username,
                        category: review.category,
                        title: review.title,
                        product_name: review.product_name,
                        content: review.content,
                        rate: review.rate,
                        image_path: review.image_path,
                        creation_time: review.creation_time,
                        comments: commentIds,
                        review_tags: review.tags
                    },
                    upsert: {
                        review_id: review.review_id,
                        creator_username: review.creator_username,
                        category: review.category,
                        title: review.title,
                        product_name: review.product_name,
                        content: review.content,
                        rate: review.rate,
                        image_path: review.image_path,
                        creation_time: review.creation_time,
                        comments: commentIds,
                        review_tags: review.tags
                    }
                });
            });

            data.comments.forEach(comment => {
                body.push({ update: { _index: indexName, _id: comment.comment_id } });
                body.push({
                    doc: {
                        creator_username: comment.creator_username,
                        review_id: comment.review_id,
                        text: comment.text,
                        creation_time: comment.creation_time
                    },
                    upsert: {
                        creator_username: comment.creator_username,
                        review_id: comment.review_id,
                        text: comment.text,
                        creation_time: comment.creation_time
                    }
                });
            });
            await client.bulk({ body });
            console.log(`Index ${indexName} successfully created.`);
        }

    } catch (error) {
        console.error(error);
    }
}

export default indexDB;