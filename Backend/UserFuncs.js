import * as db from "DBRequests.js";
import User from "./DBModels/user.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

function CreateUser(user) {
    return new Promise((resolve, reject) => {
        try {
            var newUser = new User(user);
        } catch (error) {
            reject(new Error(error));
        }
        newUser.password = GetHashedPassword(newUser.password);
        let userKeys = Object.keys(newUser);
        let userValues = '"' + Object.values(newUser).join('", "') + '"';
        let table = "Users";
        db.createQuery(table, userKeys, userValues)
            .then(res => {
                resolve(true);
            })
            .catch(err => {
                reject(new Error(err));
            })
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
        var table = "Users",
            column = "username";
        db.getQuery(table, column, username)
            .then(res => {
                console.log("this is response: ", res[0].password);
                if (VerifyPassword(password, res[0].password)) {
                    resolve(true);
                } else {
                    reject(false);
                }
            })
            .catch(err => {
                reject(new Error(err))
            })
    })
}

export {
    CreateUser,
    GenerateJWT,
    VerifyPassword,
    AuthenticateUser,
}