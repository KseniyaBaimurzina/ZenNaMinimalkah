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

const getLikesRow = function() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT review_id, COUNT(*) AS like_count FROM Likes ` +
            `GROUP BY review_id ` +
            `ORDER BY like_count DESC;`,
            function(err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    const rows = res.map(row => ({...row, like_count: row.like_count !== undefined ? row.like_count : 0 }));
                    console.log("THERE " + JSON.stringify(rows));
                    resolve(rows);
                }
            });
    });
}

const getPopularReviews = function(review_ids) {
    return new Promise((resolve, reject) => {
        if (review_ids.length === 0) resolve([])
        connection.query(`SELECT * FROM Reviews WHERE review_id IN (${review_ids});`,
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

const getReviews = function(username = null) {
    return new Promise((resolve, reject) => {
        var sqlExtra = username === null ? "" : ` WHERE creator_username = '${username}'`
        connection.query(`SELECT * ` +
            `FROM Reviews${sqlExtra} ` +
            `ORDER BY creation_time DESC;`,
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

const deleteLikeQuery = function(table, columns, values) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${table} WHERE ${columns[0]} = ${values[0]} AND ${columns[1]} = ${values[1]};`,
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
    deleteLikeQuery,
    getReviews,
    getLikesRow,
    getPopularReviews
};