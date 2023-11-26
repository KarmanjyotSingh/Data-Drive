-- Create the 'DATA_DRIVE' database
CREATE DATABASE DATA_DRIVE;

-- Switch to the 'DATA_DRIVE' database
USE DATA_DRIVE;

-- Create Users table
CREATE TABLE Users (
    username VARCHAR(255) PRIMARY KEY, -- should be unique
    password VARCHAR(255) NOT NULL,    -- should be hashed
    bucket_name VARCHAR(255) NOT NULL  -- bucket belonging to the user
);

-- Create Shared File
CREATE TABLE SharedFile (
    username VARCHAR(255),
    file_id INT,
    owner VARCHAR(255),
    permission_set ENUM('READ', 'WRITE'),
    PRIMARY KEY (username, file_id),
    FOREIGN KEY (username) REFERENCES Users(username)
    FOREIGN KEY (owner) REFERENCES Users(username)
);