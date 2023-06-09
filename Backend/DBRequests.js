import connection from "./DBConnection.js"

const getQuery = function(table, columns = null, values = null) {
    return new Promise((resolve, reject) => {
        var sqlExtra = (columns === null && values === null) ? "" : ` WHERE ${columns} = ${values}`;
        connection.query(`SELECT * FROM ${table}${sqlExtra};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

const getPopularReviews = function() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT Reviews.*,` +
            `COUNT(DISTINCT Likes.creator_username) AS like_count, ` +
            `COALESCE(AVG(Ratings.rate), 0) AS users_rating ` +
            `FROM Reviews ` +
            `LEFT JOIN Likes ON Reviews.review_id = Likes.review_id ` +
            `LEFT JOIN Ratings ON Reviews.review_id = Ratings.review_id ` +
            `GROUP BY Reviews.review_id ` +
            `ORDER BY users_rating DESC, Reviews.creation_time DESC;`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

const getReviews = function(username = null) {
    return new Promise((resolve, reject) => {
        var sqlExtra = username === null ? "" : ` WHERE creator_username = '${username}'`
        connection.query(`SELECT Reviews.*, COALESCE(Likes.likes_count, 0) AS like_count, ` +
            `COALESCE(Ratings.users_rating, 0) AS users_rating ` +
            `FROM Reviews ` +
            `LEFT JOIN ( ` +
            `SELECT review_id, COUNT(*) AS likes_count ` +
            `FROM Likes ` +
            `GROUP BY review_id ` +
            `) AS Likes ON Reviews.review_id = Likes.review_id ` +
            `LEFT JOIN ( ` +
            `SELECT review_id, AVG(rate) AS users_rating, COUNT(*) AS rating_count ` +
            `FROM Ratings ` +
            `GROUP BY review_id ` +
            `) AS Ratings ON Reviews.review_id = Ratings.review_id ` +
            `${sqlExtra} ORDER BY Reviews.creation_time DESC;`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

const createQuery = function(table, column, value) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} (${column}) VALUES (${value});`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

const createTagsQuery = function(tags) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT IGNORE INTO Tags (tag) VALUES ${tags};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

const createRevTagsQuery = function(table, column, value) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} (${column}) VALUES ${value};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

const updateCreateQuery = function(table, columns, values, updCol, updVal) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} (${columns}) VALUES (${values}) ON DUPLICATE KEY UPDATE ${updCol} = ${updVal};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

const updateQuery = function(table, checkCol, checkValue, updCol, updValue = null) {
    return new Promise((resolve, reject) => {
        var sqlExtra = updValue === null ? '' : ` = ${updValue}`
        connection.query(`UPDATE ${table} SET ${updCol}${sqlExtra} WHERE ${checkCol} = ${checkValue};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

const deleteLikeQuery = function(table, columns, values) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${table} WHERE ${columns[0]} = ${values[0]} AND ${columns[1]} = ${values[1]};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

const deleteQuery = function(table, column, value) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${table} WHERE ${column} = ${value};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

export {
    getQuery,
    createQuery,
    createTagsQuery,
    createRevTagsQuery,
    updateCreateQuery,
    updateQuery,
    deleteQuery,
    deleteLikeQuery,
    getReviews,
    getPopularReviews
};