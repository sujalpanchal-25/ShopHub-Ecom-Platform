# 🛒 ShopHub — Next-Gen E-Commerce Platform

ShopHub is a responsive e-commerce platform built with a modern tech stack. It features a futuristic, dark-themed UI with glassmorphism effects, robust JWT authentication, and a real-time dynamic inventory management system.

---

## 📋 Table of Contents
- [Key Features](#-key-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup-reactvite)
  - [Creating a Superuser](#how-to-create-the-superuser)
- [Demo & Media](#-demo-video)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#author)

---

## ✨ Key Features

* **Real-Time Inventory Management:** Intelligent stock-checking algorithm that dynamically disables "Add to Cart" buttons for depleted assets, prevents over-ordering, and automatically deducts/restores stock during order creation and cancellation.
* **Secure User Authentication:** End-to-end secure login and registration system utilizing JSON Web Tokens (JWT).
* **Advanced Cart & Wishlist System:** Persistent cart and wishlist states managed globally via React Context API.
* **Order Processing Pipeline:** Comprehensive checkout system with automated tax calculation, subtotal tracking, and order history management.
* **Automated Database Seeding:** Custom Python script to instantly populate the MySQL database with premium categories and classified asset products.
* **Next-Gen UI/UX:** Fully responsive, mobile-first design built with Tailwind CSS, featuring ambient glowing backgrounds, seamless flex-box stacking, and intelligent text-wrapping.
* **Django Admin Dashboard:** Fully integrated administrative interface to manage users, products, categories, and order statuses, allowing for efficient backend content control without manual database queries.

---

## 🛠️ Tech Stack

### Frontend
* React.js (Vite)
* React Router DOM
* Tailwind CSS
* React Context API (State Management)

### Backend
* Python
* Django
* Django REST Framework (DRF)
* SimpleJWT (Authentication)

### Database
* MySQL

---

## 📂 Project Structure
```markdown
ecommerce-application/
├── backend/
│   ├── manage.py
│   ├── settings.py
│   ├── urls.py
│   ├── store/
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── __init__.py
│   ├── __init__.py
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   ├── context/
│   │   │   ├── CartContext.jsx
│   │   ├── __init__.js
│   ├── package.json
│   ├── vite.config.js
├── README.md
```

---


## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* **Node.js:** v16+
* **Python:** 3.9+
* **MySQL Server**

### 1. Backend Setup

1. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   ```
   * **On Windows:**
     ```bash
     venv\Scripts\activate
     ```
   * **On macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

2. **Install the required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Database & Run Migrations:**
   Configure your MySQL database settings in `backend/settings.py`, then run:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Seed the Database (Optional but Recommended):**
   Populate your fresh database with categories and products using the custom seed script:
   ```bash
   python seed_data.py
   ```

5. **Start the Django development server:**
   ```bash
   python manage.py runserver
   ```

### 2. Frontend Setup (React/Vite)

1. **Navigate to the frontend directory:**
   Open a new terminal and run:
   ```bash
   cd frontend
   ```

2. **Install the Node modules:**
   ```bash
   npm install
   ```

3. **Configure your environment variables:**
   Create a `.env` file in the root of the `frontend` folder:
   ```env
   VITE_BASE_URL=http://127.0.0.1:8000
   ```

4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

### How to Create the Superuser

1. Open your terminal and ensure you are in the directory containing `manage.py`.
2. Run the command:
   ```bash
   python manage.py createsuperuser
   ```
3. Provide details (username, email, and password):
   > ℹ️ *Note: When typing the password, no characters will appear on the screen—this is a standard security feature in command-line interfaces. Just type your password and press Enter.*
4. Once you see `Superuser created successfully`, you can log in to the Django admin panel.

---

## 🎥 Demo Video

[Watch Demo Video](./assets/A7.mp4)

---

## 📸 Screenshots

### Home Page
<img src="assets/A1.png" width="800" alt="Home Page">

---

### Product Details
<img src="assets/A2.png" width="800" alt="Product Detail Page">

---

### Cart Page
<img src="assets/A3.png" width="800" alt="Cart Page">

---

### WishList Page
<img src="assets/A4.png" width="800" alt="WishList Page">

---

### Search Box
<img src="assets/A5.png" width="800" alt="Search Box">

---

### CheckOut Page 
<img src="assets/A6.png" width="800" alt="Checkout Page">

---

## 🤝 Contributing
To contribute to the project, please follow these steps:
1. Fork the repository: `git fork https://github.com/your-username/ecommerce-application.git`
2. Create a new branch: `git branch feature/your-feature`
3. Commit your changes: `git commit -m "Your commit message"`
4. Push your changes: `git push origin feature/your-feature`
5. Create a pull request: `https://github.com/your-username/ecommerce-application/pulls`

## 📝 License
The project is licensed under the MIT License.

## 📬 Contact
For any questions or concerns, please contact us at [sujalpanchal257@gmail.com](mailto:sujalpanchal257@gmail.com)

---

## 👨‍💻 Author

**Sujal Panchal**

📧 Email: [sujalpanchal257@gmail.com](mailto:sujalpanchal257@gmail.com)

🐙 GitHub: [sujalpanchal-25](https://github.com/sujalpanchal-25)

💼 LinkedIn: [Sujal Panchal](https://www.linkedin.com/in/sujal-panchal-11686035a/)

