# Footwear E-Commerce Website 👟

A full-stack footwear e-commerce web application built using **React.js**, **Django REST Framework**, and **MySQL**.

The project provides a complete online shopping experience with authentication, cart management, online payments, order tracking, admin analytics, and inventory monitoring.

---

## 🚀 Features

### 👤 User Features
* **User Registration & Login:** Secured with JWT Authentication.
* **Persistent Login:** Sessions remain active across refreshes.
* **Product Discovery:** Product Listing, Detail Views, Search, Filter, and Sort.
* **Cart Management:** Seamlessly add to cart and adjust quantities.
* **Checkout System:** Integrated with **Razorpay** for secure payments.
* **Order Tracking:** View order history and download PDF receipts.
* **Responsive UI:** Fully optimized for mobile and desktop.

### 🛠 Admin Features
* **Analytics Dashboard:** View total revenue and order trends.
* **Order Management:** Track and update order statuses.
* **Inventory Monitoring:** Real-time stock tracking with **Low Stock Alerts**.

---

## 🏗 Architecture

The project follows a **Three-Tier Client-Server Architecture**:
1.  **Frontend:** React.js (Client)
2.  **Backend API:** Django REST Framework (Server)
3.  **Database:** MySQL (Storage)

It utilizes **REST API** architecture for seamless communication between the decoupled frontend and backend.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Bootstrap, Axios, React Router DOM |
| **Backend** | Python, Django, Django REST Framework |
| **Database** | MySQL |
| **Auth** | JWT (JSON Web Tokens) |
| **Payment** | Razorpay Gateway |
| **Reporting** | ReportLab (PDF Generation) |

---

## 💳 Payment Flow

1.  **Order Placement:** User initiates checkout.
2.  **Order Creation:** Backend generates a unique Razorpay Order ID.
3.  **Checkout:** Razorpay UI handles the transaction.
4.  **Verification:** Backend validates the payment signature.
5.  **Confirmation:** Order status updates and a PDF receipt is generated/emailed.

---

## ⚙ Installation

### 1. Clone Repository
```bash
git clone [https://github.com/Kalidasan02/Footwear_Ecommerce_website.git](https://github.com/Kalidasan02/Footwear_Ecommerce_website.git)

```
### 2. Backend Setup
```
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```
### 3. Frontend Setup
```
cd frontend
npm install
npm run dev

```
### API Endpoints
<details>
  <summary>🚀 Click to view API Endpoints</summary>
  <br>

  | Category | Endpoint | Method | Description |
  | :--- | :--- | :--- | :--- |
  | **Auth** | `/api/users/register/` | `POST` | Register new user |
  | **Auth** | `/api/users/login/` | `POST` | Get JWT Token |
  | **Products** | `/api/products/` | `GET` | List all products |
  | **Products** | `/api/products/<id>/` | `GET` | Product details |
  | **Cart** | `/api/cart/` | `GET` | View user cart |
  | **Cart** | `/api/cart/add/` | `POST` | Add item to cart |
  | **Orders** | `/api/orders/checkout/` | `POST` | Process checkout |
  | **Orders** | `/api/orders/receipt/<id>/` | `GET` | Download PDF receipt |
  | **Payments** | `/api/payments/create-order/` | `POST` | Create Razorpay order |
  | **Payments** | `/api/payments/verify-payment/` | `POST` | Verify payment signature |

</details>

---

## 👨‍💻 Author

**Kalidasan S**
*Full Stack Developer*

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Django](https://img.shields.io/badge/django-%23092e20.svg?style=for-the-badge&logo=django&logoColor=white) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

---

## 📄 License

This project is for educational and portfolio purposes. 
Feel free to use the code for learning or as a reference for your own projects!
