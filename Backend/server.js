import express from "express";

const config = dotenv.config(".env").parsed;
const app = express();


app.listen(config["PORT"], () => {
    console.log(`Example app listening on port ${config["PORT"]}`)
})