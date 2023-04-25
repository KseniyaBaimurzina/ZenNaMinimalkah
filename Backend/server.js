import express from "express";
import cors from "cors";
import crypto from "crypto";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "./DBModels/user.js";
import Review from "./DBModels/review.js";
import Comment from "./DBModels/comment.js";
import * as db from "./DBRequests.js";

const config = dotenv.config(".env").parsed;
var corsOptions = {
    origin: JSON.parse(config["ALLOWED_ORIGINS"]),
    methods: ['GET', 'PUT', 'POST', "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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

function AuthorizeUser(access_token) {
    return new Promise((resolve, reject) => {
        jwt.verify(access_token, config["SECRET_JWT_KEY"], (err, verifyRes) => {
            if (err) {
                reject(err);
            } else {
                var table = "Users",
                    column = "username",
                    username = "'" + verifyRes.username + "'";
                db.getQuery(table, column, username)
                    .then(res => {
                        resolve(true);
                    })
                    .catch(err => {
                        reject(new Error(err));
                    });
            }
        });
    });
}

function CreateReview(access_token, review) {
    return new Promise(async(resolve, reject) => {
        try {
            var rev = review;
            rev["creator_username"] = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username;
            var newReview = new Review(rev),
                table = "Reviews",
                columns = Object.keys(rev),
                values = '"' + Object.values(rev).join('", "') + '"',
                res = await db.createQuery(table, columns, values);
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function UpdateReview(access_token, review) {
    return new Promise(async(resolve, reject) => {
        try {
            var rev = review;
            rev["creator_username"] = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username;
            var revToUpd = new Review(rev),
                table = "Reviews",
                checkCol = "review_id",
                checkValue = revToUpd.review_id;
            delete rev.review_id;
            var updCol = Object.keys(rev),
                updValue = Object.values(rev),
                res = await db.updateQuery(table, checkCol, updCol, checkValue, updValue);
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
            var table = "Reviews",
                column = "review_id",
                value = review.review_id,
                res = await db.deleteQuery(table, column, value);
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function CreateRate(rate, review_id, access_token) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = "'" + jwt.verify(access_token, config["SECRET_JWT_KEY"]).username + "'",
                table = "Ratings",
                columns = ["review_id", "creator_username", "rate"],
                values = [review_id, username, rate],
                res = await db.createQuery(table, columns, values);
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

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

function CreateLike(review_id, is_liked, access_token) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username,
                table = "Likes",
                columns = ["review_id", "creator_username"],
                values = [review_id, "'" + username + "'"],
                res = is_liked ? await db.createQuery(table, columns, values) : await db.deleteLikeQuery(table, columns, values);
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetUsersLikes(access_token) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username,
                table = "Likes",
                column = "creator_username",
                value = "'" + username + "'",
                res = await db.getQuery(table, column, value);
            var reviewIds = res.map(row => row.review_id);
            console.log("THIS IS REVIEWIDS " + JSON.stringify(reviewIds));
            resolve(reviewIds);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetUsersRate(access_token) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username,
                table = "Ratings",
                column = "creator_username",
                value = "'" + username + "'",
                res = await db.getQuery(table, column, value);
            var reviewIds = res.map(row => row.review_id);
            console.log("THIS IS REVIEWIDS " + JSON.stringify(reviewIds));
            resolve(reviewIds);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetPopularReviews(page) {
    return new Promise(async(resolve, reject) => {
        try {
            console.log(page + '\n' + typeof page)
            var reviewsPerPage = 10,
                offset = (parseInt(page) - 1) * reviewsPerPage,
                likesRows = await db.getLikesRow(reviewsPerPage, offset),
                reviewIds = likesRows.map(row => row.review_id);
            var reviews = await db.getPopularReviews(reviewIds),
                ratingPromises = reviews.map(obj => GetRating(obj.review_id));
            var ratings = await Promise.all(ratingPromises);
            reviews.forEach((obj, index) => {
                obj.users_rating = ratings[index];
                const likeRow = likesRows.find(row => row.review_id === obj.review_id);
                obj.like_count = likeRow ? likeRow.like_count : 0;
            });
            resolve(reviews);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetLatestReviews(page) {
    return new Promise(async(resolve, reject) => {
        try {
            var reviewsPerPage = 10,
                offset = (parseInt(page) - 1) * reviewsPerPage,
                likesRows = await db.getLikesRow(reviewsPerPage, offset),
                reviews = await db.getReviews(reviewsPerPage, offset);
            var ratingPromises = reviews.map(obj => GetRating(obj.review_id));
            var ratings = await Promise.all(ratingPromises);
            reviews.forEach((obj, index) => {
                obj.users_rating = ratings[index];
                const likeRow = likesRows.find(row => row.review_id === obj.review_id);
                obj.like_count = likeRow ? likeRow.like_count : 0;
            });
            resolve(reviews);
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

function GetRating(review_id) {
    return new Promise(async(resolve, reject) => {
        try {
            var table = "Ratings",
                column = "review_id",
                value = review_id,
                res = await db.getQuery(table, column, value);
            var averageRating = res.reduce((acc, curr) => acc + curr.rate, 0) / res.length;
            console.log("This is average rating " + averageRating);
            resolve(averageRating);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function GetUserReviews(access_token, page) {
    return new Promise(async(resolve, reject) => {
        try {
            var username = jwt.verify(access_token, config["SECRET_JWT_KEY"]).username,
                reviewsPerPage = 10,
                offset = (parseInt(page) - 1) * reviewsPerPage,
                res = await db.getReviews(reviewsPerPage, offset, username);
            resolve(res);
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

app.post("/registration", function(req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400)
        res.send("Fields cannot be empty")
        return
    }
    CreateUser(req.body)
        .then(result => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.error(err);
            res.status(err.status);
            res.send(err.message);
        });
})

app.post("/login", function(req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400);
        res.send("Fields cannot be empty");
        return;
    }
    let username = '"' + req.body.username + '"';
    AuthenticateUser(username, req.body.password)
        .then(result => {
            console.log(result);
            let token = GenerateJWT(req.body.username);
            res.cookie("access_token", token);
            res.status(200);
            res.send({ "access_token": token, "token_type": "bearer" });
            return;
        })
        .catch(err => {
            console.error(err);
            res.status(err.status);
            res.send(err.message);
        });
});

app.post("/review", async function(req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400);
        res.send("Fields cannot be empty");
        return;
    }
    try {
        await AuthorizeUser(req.cookies.access_token);
        await CreateReview(req.cookies.access_token, req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(err.status);
        res.send(err.message);
    }
})

app.put("/review", async function(req, res) {
    try {
        await AuthorizeUser(req.cookies.access_token);
        await UpdateReview(req.cookies.access_token, req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(err.status);
        res.send(err.message);
    }
});

app.delete("/review", async function(req, res) {
    try {
        console.log(req)
        await AuthorizeUser(req.cookies.access_token);
        await CreateLike(req.body.review_id, false, req.cookies.access_token)
        await DeleteReview(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(err.status);
        res.send(err.message);
    }
});

app.get("/reviews", async function(req, res) {
    try {
        var popularReviews = await GetPopularReviews(req.query.offset),
            latestReviews = await GetLatestReviews(req.query.offset);
        var reviews = { 'popularReviews': popularReviews, 'latestReviews': latestReviews };
        if (req.cookies.access_token) {
            reviews.liked_reviews = await GetUsersLikes(req.cookies.access_token);
            reviews.rated_reviews = await GetUsersRate(req.cookies.access_token);
        }
        res.status(200);
        res.send(reviews);
    } catch (err) {
        console.error(err);
        res.status(err.status);
        res.send(err.message);
    }
})

app.get("/user/reviews", async function(req, res) {
    try {
        var userReviews = await GetUserReviews(req.cookies.access_token, req.query.offset);
        res.status(200);
        res.send(userReviews);
    } catch (err) {
        console.error(err);
        res.status(err.status);
        res.send(err.message);
    }
})

app.get("/review/comments", async function(req, res) {
    try {
        var comments = await GetReviewComments(req.query.review_id);
        res.status(200);
        res.send(comments);
    } catch (err) {
        console.error(err);
        res.status(err.status);
        res.send(err.message);
    }
})

app.get("/categories", async function(req, res) {
    try {
        var categories = await GetCategories();
        res.status(200);
        res.send(categories);
    } catch (err) {
        console.error(err);
        res.status(err.status);
        res.send(err.message);
    }
})

app.post("/rate", async function(req, res) {
    try {
        await AuthorizeUser(req.cookies.access_token);
        await CreateRate(req.body.rate, req.body.review_id, req.cookies.access_token);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(err.status);
        res.send(err.message);
    }
})

app.post("/comment", async function(req, res) {
    try {
        await AuthorizeUser(req.cookies.access_token);
        await CreateComment(req.body.comment, req.body.review_id, req.cookies.access_token);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(err.status);
        res.send(err.message);
    }
})

app.post("/like", async function(req, res) {
    try {
        await AuthorizeUser(req.cookies.access_token);
        await CreateLike(req.body.review_id, req.body.is_liked, req.cookies.access_token);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(err.status);
        res.send(err.message);
    }
});

app.listen(config["PORT"], () => {
    console.log(`Example app listening on port ${config["PORT"]}`)
})