import * as db from "../DBRequests.js";
import Comment from "../DBModels/comment.js";

function CreateComment(comment, review_id, username) {
    return new Promise(async(resolve, reject) => {
        try {
            var comm = {
                creator_username: username,
                review_id: review_id,
                text: comment
            }
            var newComment = new Comment(comm);
            await db.createQuery(
                table = "Comments",
                columns = Object.keys(comm),
                values = '"' + Object.values(comm).join('", "') + '"'
            );
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
            var res = await db.getQuery("Comments", "review_id", review_id)
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