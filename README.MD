# Paytm Clone (Payment App)

A full-stack digital wallet application allowing users to sign up, manage their balance, search for other users, and transfer money securely.

[**Live Demo**](https://payment-app123.netlify.app/)


## Features

-   **User Authentication**: Secure Signup and Signin/Login functionality.
-   **Dashboard**: View current account balance immediately upon logging in.
-   **User Search**: Filterable list of users to find friends or merchants.
-   **Money Transfer**:
    -   Secure transfer flow with transaction support (sessions).
    -   Input validation: Minimum amount (1), no negative numbers.
    -   Account verification: Prevents transfers to invalid or missing accounts.
-   **UI/UX**:
    -   Clean, modern interface using Tailwind CSS.
    -   Responsive design.

## Tech Stack

-   **Frontend**: React, React Router, Tailwind CSS, Axios.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (with Mongoose).
-   **Validation**: Zod (schema validation).
-   **Authentication**: JWT (JSON Web Tokens).

## Setup & Installation

### Prerequisites
-   Node.js installed.
-   MongoDB connection string (update in `backend/db.js` and `backend/repair_accounts.js` if needed).

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node index.js
    ```
    (The server runs on port 3000 by default).

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    (Access the app at `http://localhost:5173`).

## API Endpoints

-   `POST /api/v1/user/signup` - Create a new user account.
-   `POST /api/v1/user/signin` - Log in to an existing account.
-   `PUT /api/v1/user` - Update user information.
-   `GET /api/v1/user/bulk` - Search for users (filter via query param).
-   `GET /api/v1/account/balance` - Get authenticated user's balance.
-   `POST /api/v1/account/transfer` - Transfer money to another user.

## Recent Updates
-   **UI Overhaul**: Updated "Send Money" screen with consistent styling and back navigation.
-   **Validation**: Enhanced backend protection against invalid transfer amounts.
-   **Fixes**: Resolved React list key warnings and repaired missing account data for legacy users.
