import * as db from "DBRequests.js";
import Comment from "./DBModels/user.js";
import jwt from "jsonwebtoken";

function CreateComment(comment, review_id, access_token) {
    return new Promise(async(resolve, reject) => {
        try {
            var comm = new Object();
            comm["creator_username"] = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username;
            comm["review_id"] = review_id;
            comm["text"] = comment;
            var newComment = new Comment(comm);
            comm["creator_username"] = comm["creator_username"];
            var table = "Comments",
                columns = Object.keys(comm),
                values = '"' + Object.values(comm).join('", "') + '"',
                res = await db.createQuery(table, columns, values);
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetReviewComments(review_id) {
    return new Promise(async(resolve, reject) => {
        try {
            var table = "Comments",
                column = "review_id",
                values = review_id,
                res = await db.getQuery(table, column, values)
            resolve(res || []);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

export {
    CreateComment,
    GetReviewComments,
}