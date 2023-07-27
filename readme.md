# Wallet Management API

The Wallet Management API is a RESTful API that allows users to create accounts, deposit and withdraw funds into/from their wallets, and transfer money to other users.

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Create a New User](#create-a-new-user)
  - [User Login](#user-login)
  - [Deposit into Wallet](#deposit-into-wallet)
  - [Withdraw from Wallet](#withdraw-from-wallet)
  - [Transfer Money](#transfer-money)
- [Helpers](#helpers)
- [Service Modules](#service-modules)
- [License](#license)
- [POSTMAN DOCUMENTATION](#postman-documentation)
## Getting Started

1. Clone the repository to your local machine.
2. Install the required dependencies using npm or yarn.
3. Set up your database and configure the database connection settings in `config.js`.
4. Run the API server using `npm start` or `yarn start`.

## Authentication

The API uses JSON Web Tokens (JWT) for user authentication. When a user logs in, the API issues a JWT token that must be included in the Authorization header of subsequent API requests as a Bearer token. This token is used to authenticate and authorize the user for accessing protected routes.

## Endpoints

### Create a New User

Create a new user account with a unique email and password.

- **URL:** `/api/users/signup`
- **Method:** `POST`
- **Request Body:**
  - `email` (string): The email address of the new user.
  - `password` (string): The password for the new user account.
- **Response:**
  - `message` (string): Success message if the user is created successfully.

### User Login

Login an existing user with their email and password.

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Request Body:**
  - `email` (string): The email address of the user.
  - `password` (string): The password for the user account.
- **Response:**
  - `id` (string): The user's unique identifier.
  - `user` (string): The user's email address.
  - `token` (string): JWT token for authentication.

### Deposit into Wallet

Deposit funds into the user's wallet.

- **URL:** `/api/users/deposit`
- **Method:** `POST`
- **Authorization Header:** `Bearer <JWT Token>`
- **Request Body:**
  - `amount` (number): The amount to deposit into the wallet.
- **Response:**
  - `message` (string): Success message.
  - `deposit` (object): Details of the deposit transaction.

### Withdraw from Wallet

Withdraw funds from the user's wallet.

- **URL:** `/api/users/withdraw`
- **Method:** `POST`
- **Authorization Header:** `Bearer <JWT Token>`
- **Request Body:**
  - `amount` (number): The amount to withdraw from the wallet.
- **Response:**
  - `message` (string): Success message.
  - `newBalance` (number): The new wallet balance after withdrawal.

### Transfer Money

Transfer funds from the user's wallet to another user's wallet.

- **URL:** `/api/users/transfer`
- **Method:** `POST`
- **Authorization Header:** `Bearer <JWT Token>`
- **Request Body:**
  - `email` (string): The email address of the receiver.
  - `amount` (number): The amount to transfer to the receiver.
- **Response:**
  - `message` (string): Success message.
  - `walletOwner` (string): The email address of the sender.

## How to Use the API

1. Register a new user by making a `POST` request to `/api/users/signin` with the `email` and `password` in the request body.
2. Login an existing user by making a `POST` request to `/api/users/login` with the `email` and `password` in the request body. Retrieve the JWT token from the response.
3. For depositing into the wallet, make a `POST` request to `/api/users/deposit` with the `amount` in the request body and the JWT token in the authorization header.
4. For withdrawing from the wallet, make a `POST` request to `/api/users/withdraw` with the `amount` in the request body and the JWT token in the authorization header.
5. To transfer money to another user, make a `POST` request to `/api/users/transfer` with the `email` and `amount` in the request body and the JWT token in the authorization header.

## Helpers

### bcrypt.js

- `comparePassword(password, hashedPassword)`: Compares a plain text password with a hashed password to check for a match.
- `hashedPassword(password)`: Hashes a plain text password.

### jwt.js

- `generateToken(payload)`: Generates a JSON Web Token (JWT) using the provided payload.
- `setTokenCookie(res, token)`: Sets the JWT as a cookie in the response headers.

## Service Modules

### user.service.js

- `createUser(email, password)`: Creates a new user in the database.
- `findUserById(userId)`: Finds a user by their unique identifier (ID).
- `findByEmail(email)`: Finds a user by their email address.

### wallet.service.js

- `createWallet(userId, email)`: Creates a new wallet for the user.
- `depositIntoWallet(userId, amount)`: Deposits funds into the user's wallet.
- `checkIfWalletBelongsToUser(userId, email)`: Checks if the wallet belongs to the user.
- `updateWalletBalance(newBalance, userId, walletId)`: Updates the wallet balance.
- `withdrawFromWallet(userId, amount)`: Withdraws funds from the user's wallet.

### transaction.service.js

- `createTransaction(userId, walletId, amount, newBalance, type )`: Creates a new transaction record.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as you see fit.

## Postman Documentation 
[Link to Postman][https://documenter.getpostman.com/view/28790754/2s946pZUaU]

