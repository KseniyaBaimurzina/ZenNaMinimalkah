import connection from "./DBConnection.js"

const getQuery = function(table, columns = null, values = null) {
    return new Promise((resolve, reject) => {
        var sqlExtra = (columns === null && values === null) ? "" : ` WHERE ${columns} = ${values}`;
        console.log("This is sqlExtra: " + sqlExtra)
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

const getLikesRow = function(reviewsPerPage, offset) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT review_id, COUNT(*) AS like_count FROM Likes ` +
            `GROUP BY review_id ` +
            `ORDER BY like_count DESC ` +
            `LIMIT ${reviewsPerPage} ` +
            `OFFSET ${offset};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log("THERE " + JSON.stringify(res));
                    resolve(res);
                }
            });
    });
}

const getPopularReviews = function(review_ids) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM Reviews WHERE review_id = ${review_ids};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(res);
                    resolve(res);
                }
            });
    });
}

const getReviews = function(reviewsPerPage, offset, username = null) {
    return new Promise((resolve, reject) => {
        var sqlExtra = username === null ? "" : ` WHERE creator_username = '${username}'`
        connection.query(`SELECT * ` +
            `FROM Reviews${sqlExtra} ` +
            `ORDER BY creation_time DESC ` +
            `LIMIT ${reviewsPerPage} ` +
            `OFFSET ${offset};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(res);
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
                    console.log(res);
                    resolve(res);
                }
            });
    });
}

const updateQuery = function(table, checkCol, updCol, checkValue, updValue) {
    return new Promise((resolve, reject) => {
        var updStr = updCol.map((item, index) => item + " = '" + updValue[index] + "'").join(', ');
        console.log("This is updStr " + updStr)
        connection.query(`UPDATE ${table} SET ${updStr} WHERE ${checkCol} = ${checkValue};`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(res);
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
                    console.log(res);
                    resolve(res);
                }
            });
    });
}

export {
    getQuery,
    createQuery,
    updateQuery,
    deleteQuery,
    getReviews,
    getLikesRow,
    getPopularReviews
};