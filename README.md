# 🛒 MERN Stack Multi-Vendor Marketplace

This is a complete, full-stack e-commerce solution built with the MERN stack (MongoDB, Express, React, Node) designed to host multiple sellers (vendors) and manage products, sales, and administration efficiently.

## ✨ Key Features

The marketplace includes the following functionalities:

### 👤 User & Role Management
* **Authentication:** Secure Login and Registration for all users.
* **Role-Based Access:** Dedicated roles for **Buyer**, **Seller**, **Admin**, and **Super Admin**.
* **User Management:** Admin controls to view all users, manage roles (Promote/Demote to Seller/Admin), and enforce security (Ban/Unban users).

### 📦 Product & Inventory
* **Seller Dashboard:** Sellers can add, edit, and delete their specific products.
* **Image Upload:** Products support direct image file uploads using **Multer** and `multipart/form-data`.
* **Inventory Control:** Stock levels are managed and updated automatically upon order placement/cancellation.

### 🛍️ E-commerce Flow
* **Shopping Cart:** Persistent cart state for adding, removing, and adjusting product quantities.
* **Checkout Process:** Step-by-step flow for Shipping Address entry and Payment Method selection.
* **Order Placement:** Final confirmation and submission of the order to the backend.

### 📈 Dashboard & Order Processing
* **My Orders (Buyer):** Buyers can view their order history and cancel pending orders.
* **My Sales (Seller):** Sellers can view their received orders (sales) and update shipping status (Mark as Shipped).
* **Admin Order Management:** Admins can view all orders globally and update final payment status (Mark Paid - for COD) and delivery status (Mark Delivered).

### ⭐ Reviews & Rating System
* **Data Models:** Setup of `Review` and updated `Product` models to store and calculate average ratings and number of reviews (Initial Phase).

---

## 💻 Technologies Used

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js | UI development. |
| **State Management** | React Context API / Redux | Global state handling (e.g., Cart, Auth). |
| **Routing** | React Router DOM | Client-side navigation. |
| **Backend** | Node.js / Express.js | RESTful API server. |
| **Database** | MongoDB / Mongoose | NoSQL database and ODM. |
| **Security** | JWT (JSON Web Tokens) | Stateless authentication. |
| **File Uploads** | Multer | Handling `multipart/form-data` for image files. |
| **HTTP Client** | Axios | Making API requests from the frontend. |

---

## 🚀 Local Setup & Installation

Follow these steps to get your development environment running locally:

### Prerequisites

* Node.js (LTS version)
* npm or yarn
* A running MongoDB instance (Local or Atlas)

### Step 1: Clone the Repository

Since you are starting from your local machine, you will perform the Git steps below first, then the setup. For now, assume this structure:



### Step 2: Configure Environment Variables

Create a file named `.env` in the root of your **server/** directory and add your configuration details.

### Step 3: Install Dependencies

Navigate into the root of both the server and client directories and install dependencies.

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
