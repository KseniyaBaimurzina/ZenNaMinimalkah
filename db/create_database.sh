#!/bin/bash
export $(grep -v '^#' .env | xargs)

DB_NAME="reviewapp"

MYSQL_COMMAND=" 
    CREATE DATABASE IF NOT EXISTS ${DB_NAME}; 
    CREATE USER IF NOT EXISTS '${DB_USERNAME}'@'${DB_HOSTNAME}' IDENTIFIED BY '${DB_PASSWORD}';
    GRANT ALL PRIVILEGES ON * . * TO '${DB_USERNAME}'@'${DB_HOSTNAME}';
    FLUSH PRIVILEGES;
    USE ${DB_NAME};

    CREATE TABLE IF NOT EXISTS Roles  (role VARCHAR(10) UNIQUE, PRIMARY KEY (role));

    CREATE TABLE IF NOT EXISTS Users (
        email VARCHAR(100) NOT NULL UNIQUE, 
        username VARCHAR(50) NOT NULL UNIQUE, 
        password VARCHAR(100) NOT NULL, 
        role VARCHAR(50) NOT NULL, 
        PRIMARY KEY (username), 
        FOREIGN KEY (role) REFERENCES Roles(role)
        );

    CREATE TABLE IF NOT EXISTS Tags (tag VARCHAR(100) NOT NULL UNIQUE, PRIMARY KEY (tag));

    CREATE TABLE IF NOT EXISTS Categories (category VARCHAR(50) NOT NULL UNIQUE, PRIMARY KEY (category));

    CREATE TABLE IF NOT EXISTS Reviews (
        review_id int NOT NULL UNIQUE AUTO_INCREMENT, 
        creator_username VARCHAR(100) NOT NULL, 
        category VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL, 
        content MEDIUMTEXT NOT NULL, 
        rate int NOT NULL, 
        image_path VARCHAR(255), 
        creation_time DATETIME DEFAULT CURRENT_TIMESTAMP, 
        PRIMARY KEY (review_id), 
        FOREIGN KEY (creator_username) REFERENCES Users(username), 
        FOREIGN KEY (category) REFERENCES Categories(category)
    );

    CREATE TABLE IF NOT EXISTS ReviewTags (
        review_id int NOT NULL, 
        tag VARCHAR(100) NOT NULL, 
        FOREIGN KEY (review_id) REFERENCES Reviews(review_id), 
        FOREIGN KEY (tag) REFERENCES Tags(tag), 
        PRIMARY KEY (review_id, tag)
    );

    CREATE TABLE IF NOT EXISTS Ratings (
        creator_username VARCHAR(100) NOT NULL, 
        review_id int NOT NULL, 
        rate int NOT NULL, 
        FOREIGN KEY (creator_username) REFERENCES Users(username), 
        FOREIGN KEY (review_id) REFERENCES Reviews(review_id), 
        PRIMARY KEY (creator_username, review_id)
    );

    CREATE TABLE IF NOT EXISTS Likes (
        creator_username VARCHAR(100) NOT NULL, 
        review_id int NOT NULL, 
        FOREIGN KEY (creator_username) REFERENCES Users(username), 
        FOREIGN KEY (review_id) REFERENCES Reviews(review_id), 
        PRIMARY KEY (creator_username, review_id)
    );

    CREATE TABLE IF NOT EXISTS Comments (
        comment_id int NOT NULL UNIQUE AUTO_INCREMENT, 
        creator_username VARCHAR(100) NOT NULL, 
        review_id int NOT NULL, 
        text TEXT NOT NULL, 
        creation_time DATETIME DEFAULT CURRENT_TIMESTAMP, 
        PRIMARY KEY (comment_id), 
        FOREIGN KEY (creator_username) REFERENCES Users(username), 
        FOREIGN KEY (review_id) REFERENCES Reviews(review_id)
    );

    INSERT INTO Roles (role) VALUES ('admin'), ('user');

    INSERT INTO Categories (category) VALUES ('Books'), ('Movies'), ('TV Shows'), ('Games'), ('Music');
"

mysql -u${DB_ROOT} -p${DB_ROOT_PASSWORD} -e "$MYSQL_COMMAND";