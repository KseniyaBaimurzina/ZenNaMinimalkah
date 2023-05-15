import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import indexDB from "./DBIndex.js";
import * as revFuncs from "./Functions/ReviewFuncs.js";
import * as userFuncs from "./Functions/UserFuncs.js";
import * as rateFuncs from "./Functions/RatingFuncs.js";
import * as commentFuncs from "./Functions/CommentFuncs.js"

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

indexDB();
setInterval(() => {
    indexDB();
}, 12 * 60 * 60 * 1000);

app.post("/registration", function(req, res) {
    userFuncs.CreateUser(req.body)
        .then(result => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.error(err);
            res.status(400);
            res.send(err.message);
        });
})

app.post("/login", function(req, res) {
    let username = '"' + req.body.username + '"';
    userFuncs.AuthenticateUser(username, req.body.password)
        .then(result => {
            let token = userFuncs.GenerateJWT(req.body.username);
            res.cookie("access_token", token);
            res.status(200);
            res.send({ "access_token": token, "token_type": "bearer", "role": result });
            return;
        })
        .catch(err => {
            console.error(err);
            res.status(400);
            res.send(err.message);
        });
});

app.post("/review", async function(req, res) {
    try {
        var user = await userFuncs.AuthorizeUser(req.cookies.access_token);
        await revFuncs.CreateReview(user, req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400);
        res.send(err.message);
    }
})

app.put("/review", async function(req, res) {
    try {
        var user = await userFuncs.AuthorizeUser(req.cookies.access_token);
        await revFuncs.UpdateReview(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err.message);
    }
});

app.delete("/review", async function(req, res) {
    try {
        var user = await userFuncs.AuthorizeUser(req.cookies.access_token);
        await revFuncs.DeleteReview(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err.message);
    }
});

app.get("/users", async function(req, res) {
    try {
        var user = await userFuncs.AuthorizeUser(req.cookies.access_token);
        var users = await userFuncs.GetUsersList(user);
        res.status(200);
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err.message);
    }
})

app.get("/reviews", async function(req, res) {
    try {
        var reviews = {
            'popularReviews': await revFuncs.GetPopularReviews(),
            'latestReviews': await revFuncs.GetLatestReviews()
        };
        reviews.userLikes = revFuncs.GetAuthorsLikes(reviews.latestReviews);
        try {
            var auth = await userFuncs.AuthorizeUser(req.cookies.access_token)
        } catch {
            console.log("Unauthorized")
        }
        if (auth) {
            reviews.liked_reviews = await rateFuncs.GetUsersLikes(auth.username);
            reviews.rated_reviews = await rateFuncs.GetUsersRate(auth.username);
        }
        res.status(200);
        res.send(reviews);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err.message);
    }
})

app.get("/user/reviews", async function(req, res) {
    try {
        var user = await userFuncs.AuthorizeUser(req.cookies.access_token)
        if (user.role === 'admin') {
            var reviews = {
                userReviews: await revFuncs.GetUserReviews(req.query.username)
            }
            reviews.userLikes = revFuncs.GetAuthorsLikes(reviews.userReviews)
        } else {
            var reviews = {
                userReviews: await revFuncs.GetUserReviews(jwt.verify(req.cookies.access_token, config["SECRET_JWT_KEY"]).username)
            }
            reviews.userLikes = revFuncs.GetAuthorsLikes(reviews.userReviews)
        }
        res.status(200);
        res.send(reviews);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err.message);
    }
})

app.get("/review/comments", async function(req, res) {
    try {
        var comments = await commentFuncs.GetReviewComments(req.query.review_id);
        res.status(200);
        res.send(comments);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err.message);
    }
})

app.get("/categories", async function(req, res) {
    try {
        var categories = await revFuncs.GetCategories();
        res.status(200);
        res.send(categories);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err.message);
    }
})

app.get("/tags", async function(req, res) {
    try {
        var tags = await revFuncs.GetTags("Tags");
        res.status(200);
        res.send(tags);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err.message);
    }
})

app.post("/search", async function(req, res) {
    try {
        var searchResult = await revFuncs.SearchIndex(req.body.query);
        res.status(200);
        res.send(searchResult);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err.message);
    }
})

app.post("/rate", async function(req, res) {
    try {
        var user = await userFuncs.AuthorizeUser(req.cookies.access_token);
        await rateFuncs.CreateRate(req.body.rate, req.body.review_id, user.username, req.body.rated);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400);
        res.send(err.message);
    }
})

app.post("/comment", async function(req, res) {
    try {
        var user = await userFuncs.AuthorizeUser(req.cookies.access_token);
        await commentFuncs.CreateComment(req.body.comment, req.body.review_id, user.username);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400);
        res.send(err.message);
    }
})

app.post("/like", async function(req, res) {
    try {
        var user = await userFuncs.AuthorizeUser(req.cookies.access_token);
        await rateFuncs.CreateLike(req.body.review_id, req.body.is_liked, user.username);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400);
        res.send(err.message);
    }
});

app.listen(config["PORT"], () => {
    console.log(`Pumba Reviews app listening on port ${config["PORT"]}`)
})