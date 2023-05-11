import * as db from "../DBRequests.js";
import User from "../DBModels/user.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

const config = dotenv.config(".env").parsed;

function CreateUser(user) {
    return new Promise((resolve, reject) => {
        try {
            var newUser = new User(user);
        } catch (error) {
            reject(error);
        }
        newUser.password = GetHashedPassword(newUser.password);
        db.createQuery(
                "Users",
                Object.keys(newUser),
                '"' + Object.values(newUser).join('", "') + '"'
            )
            .then(res => {
                resolve(true);
            })
            .catch(err => {
                reject(err);
            })
    });
}

function GetUsersList(user) {
    return new Promise(async(resolve, reject) => {
        try {
            if (user.role === "admin") {
                var res = await db.getQuery("Users");
                resolve(res);
            } else {
                reject(false);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}


function GetHashedPassword(password) {
    var key = config["SECRET_KEY"];
    var hmac = crypto.createHmac('sha256', key);
    var hashedPassword = hmac.update(password).digest('hex');
    return hashedPassword;
}

function GenerateJWT(username) {
    return jwt.sign({ username: username }, config["SECRET_JWT_KEY"], { expiresIn: '18000s' });
}

function VerifyPassword(plainPassword, hashedPassword) {
    return GetHashedPassword(plainPassword) == hashedPassword;
}

function AuthenticateUser(username, password) {
    return new Promise((resolve, reject) => {
        db.getQuery(
                "Users",
                "username",
                username)
            .then(res => {
                if (VerifyPassword(password, res[0].password)) {
                    resolve(res[0].role);
                } else {
                    reject(false);
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}

function AuthorizeUser(access_token) {
    return new Promise((resolve, reject) => {
        jwt.verify(access_token, config["SECRET_JWT_KEY"], (err, verifyRes) => {
            if (err) {
                reject(err);
            } else {
                db.getQuery(
                        "Users",
                        "username",
                        "'" + verifyRes.username + "'"
                    )
                    .then(res => {
                        resolve(res[0]);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });
    });
}

export {
    CreateUser,
    GetUsersList,
    GenerateJWT,
    VerifyPassword,
    AuthenticateUser,
    AuthorizeUser
}