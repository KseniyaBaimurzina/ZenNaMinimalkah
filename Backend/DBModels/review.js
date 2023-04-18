import Joi from "joi";

class Review {
    constructor(data) {
        const { error, value } = Review.schema.validate(data);
        if (error) {
            throw new Error(error)
        }
        this.review_id = value.review_id;
        this.creator_username = value.creator_username;
        this.category = value.category;
        this.title = value.title;
        this.product_name = value.product_name;
        this.content = value.content;
        this.rate = value.rate;
        this.image_path = value.image_path;
        this.creation_time = value.creation_time;
    }

    static schema = Joi.object({
        review_id: Joi.number().integer(),
        creator_username: Joi.string().required(),
        category: Joi.string().required(),
        title: Joi.string().required(),
        product_name: Joi.string().required(),
        content: Joi.string().required(),
        rate: Joi.number().integer().required(),
        image_path: Joi.string().default(null),
        creation_time: Joi.date()
    })
}

export default Review;