import Joi from "joi";

class User {
    constructor(data) {
        const { error, value } = User.schema.validate(data);
        if (error) {
            throw new Error(error)
        }
        this.username = value.username;
        this.email = value.email;
        this.password = value.password;
        this.role = value.role;

    }

    static schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().default("user").valid("user", "admin")
    })


}

export default User;