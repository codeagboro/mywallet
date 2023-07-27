-- Active: 1690461894781@@127.0.0.1@3306@walletdb

CREATE TABLE
    users (
        id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
       roles VARCHAR(255) NOT NULL DEFAULT 'user' COMMENT 'user, admin', 
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (id)
);

CREATE TABLE
        transaction (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            wallet_id INT NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            type VARCHAR(255) NOT NULL,
            balance DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (wallet_id) REFERENCES wallet(id)
        );

CREATE TABLE
    wallet (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        wallet_owner VARCHAR(255) NOT NULL UNIQUE,
        balance DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );