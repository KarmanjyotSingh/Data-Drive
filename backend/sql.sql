-- Create the 'DATA_DRIVE' database
CREATE DATABASE IF NOT EXISTS DATA_DRIVE;

-- Switch to the 'DATA_DRIVE' database
USE DATA_DRIVE;

DROP TABLE IF EXISTS Users;
-- Create Users table
CREATE TABLE Users (
    user_id VARCHAR(255) PRIMARY KEY, -- should be unique
    pass VARCHAR(255) NOT NULL,    -- should be hashed
    bucket_name VARCHAR(255) NOT NULL,  -- bucket belonging to the user
    storage_used BIGINT DEFAULT 0,
    storage_limit BIGINT DEFAULT 10000000000 -- 10 GB 
);

DROP TABLE IF EXISTS SharedFiles;
-- Create Shared File
CREATE TABLE SharedFiles (
    reciever_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    bucket_name VARCHAR(255) NOT NULL,
    sender_id VARCHAR(255) NOT NULL,
    perms VARCHAR(255) NOT NULL CHECK (perms IN ('r', 'w')),
    PRIMARY KEY (reciever_id, file_name),
    FOREIGN KEY (reciever_id) REFERENCES Users(user_id),
    FOREIGN KEY (sender_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS PublicFiles (
    user_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    bucket_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id,file_name),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS Buckets (
    bucket_name VARCHAR(255) NOT NULL,
    storage_limit BIGINT DEFAULT 100000000000, -- 100 GB
    PRIMARY KEY (bucket_name)
);

-- Add 2 users
INSERT INTO Users (user_id, pass, bucket_name) VALUES ('user1', 'user1', 'datadrive');
INSERT INTO Users (user_id, pass, bucket_name) VALUES ('user2', 'user2', 'datadrive');

INSERT INTO Users (user_id, pass, bucket_name) VALUES ('redflags', 'redflags', 'datadrive');
INSERT INTO Users (user_id, pass, bucket_name) VALUES ('user3', 'user3', 'datadrive');

-- Add 2 buckets
INSERT INTO Buckets (bucket_name) VALUES ('datadrive');
INSERT INTO Buckets (bucket_name) VALUES ('redflags');