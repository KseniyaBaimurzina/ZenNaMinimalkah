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
        password VARCHAR(50) NOT NULL, 
        role VARCHAR(50) NOT NULL, 
        PRIMARY KEY (email), 
        FOREIGN KEY (role) REFERENCES Roles(role)
        );

    CREATE TABLE IF NOT EXISTS Tags (tag VARCHAR(100) NOT NULL UNIQUE, PRIMARY KEY (tag));

    CREATE TABLE IF NOT EXISTS Categories (category VARCHAR(50) NOT NULL UNIQUE, PRIMARY KEY (category));

    CREATE TABLE IF NOT EXISTS Reviews (
        reviewID int NOT NULL UNIQUE AUTO_INCREMENT, 
        creatorEmail VARCHAR(100) NOT NULL, 
        category VARCHAR(50) NOT NULL, 
        tag VARCHAR(100) NOT NULL, 
        title VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL, 
        content MEDIUMTEXT NOT NULL, 
        creators_rate int NOT NULL, 
        image_path VARCHAR(255), 
        dateTime DATETIME DEFAULT CURRENT_TIMESTAMP, 
        PRIMARY KEY (reviewID), 
        FOREIGN KEY (creatorEmail) REFERENCES Users(email), 
        FOREIGN KEY (category) REFERENCES Categories(category), 
        FOREIGN KEY (tag) REFERENCES Tags(tag)
    );

    CREATE TABLE IF NOT EXISTS ReviewTags (
        reviewID int NOT NULL, 
        tag VARCHAR(100) NOT NULL, 
        FOREIGN KEY (reviewID) REFERENCES Reviews(reviewID), 
        FOREIGN KEY (tag) REFERENCES Tags(tag), 
        PRIMARY KEY (reviewID, tag)
    );

    CREATE TABLE IF NOT EXISTS Raitings (
        userEmail VARCHAR(100) NOT NULL, 
        reviewID int NOT NULL, 
        FOREIGN KEY (userEmail) REFERENCES Users(email), 
        FOREIGN KEY (reviewID) REFERENCES Reviews(reviewID), 
        PRIMARY KEY (userEmail, reviewID)
    );

    CREATE TABLE IF NOT EXISTS Likes (
        creatorEmail VARCHAR(100) NOT NULL, 
        reviewID int NOT NULL, 
        FOREIGN KEY (creatorEmail) REFERENCES Users(email), 
        FOREIGN KEY (reviewID) REFERENCES Reviews(reviewID), 
        PRIMARY KEY (creatorEmail, reviewID)
    );

    CREATE TABLE Comments (
        commentID int NOT NULL UNIQUE AUTO_INCREMENT, 
        creatorEmail VARCHAR(100) NOT NULL, 
        reviewID int NOT NULL, 
        text TEXT NOT NULL, 
        dateTime DATETIME DEFAULT CURRENT_TIMESTAMP, 
        PRIMARY KEY (commentID), 
        FOREIGN KEY (creatorEmail) REFERENCES Users(email), 
        FOREIGN KEY (reviewID) REFERENCES Reviews(reviewID)
    );
"

mysql -u${DB_ROOT} -p${DB_ROOT_PASSWORD} -e "$MYSQL_COMMAND";