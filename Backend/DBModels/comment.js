import Joi from "joi";

class Comment {
    constructor(data) {
        const { error, value } = Comment.schema.validate(data);
        if (error) {
            throw new Error(error)
        }
        this.comment_id = value.comment_id;
        this.creator_username = value.creator_username;
        this.review_id = value.review_id;
        this.text = value.text;
        this.creation_time = value.creation_time;
    }

    static schema = Joi.object({
        comment_id: Joi.number().integer(),
        creator_username: Joi.string().required(),
        review_id: Joi.number().integer().required(),
        text: Joi.string().required(),
        creation_time: Joi.date()
    })
}

export default Comment;