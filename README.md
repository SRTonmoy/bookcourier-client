# 📚 BookCourier Client

The **BookCourier Client** is the frontend application for the BookCourier platform — a full-stack book ordering and management system with role-based dashboards.

## 🔗 Live Demo

> *(Add your deployed client URL here)*

---

## 🧑‍💻 User Roles & Access

| Role          | Capabilities                                   |
| ------------- | ---------------------------------------------- |
| **User**      | Browse books, place orders, view order history |
| **Librarian** | Add, update, and manage books                  |
| **Admin**     | Manage users, roles, and books                 |

---

## 🚀 Features

* 🔐 **Firebase Authentication**
* 🛡 **Role-based protected routes**
* 🔄 **JWT-secured API communication**
* 📱 **Fully responsive UI**
* 🎨 **Modern UI with Tailwind & DaisyUI**
* 📦 **Axios interceptor for secure requests**
* 🧭 **Dashboard-based navigation**

---

## 🛠 Tech Stack

### Frontend

* **React**
* **React Router DOM**
* **Tailwind CSS**
* **DaisyUI**
* **Axios**

### Authentication

* **Firebase Authentication**

### Backend (Connected API)

* **Node.js**
* **Express**
* **MongoDB**
* **JWT**

---

## 📁 Project Structure

```bash
src/
│── components/
│── pages/
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   ├── Dashboard/
│   │   ├── MyOrders.jsx
│   │   ├── ManageBooks.jsx
│   │   ├── ManageUsers.jsx
│── routes/
│   ├── PrivateRoute.jsx
│   ├── AdminRoute.jsx
│   ├── LibrarianRoute.jsx
│── context/
│   └── AuthProvider.jsx
│── hooks/
│── firebase/
│   └── firebase.config.js
│── api/
│   └── axiosSecure.js
│── App.jsx
│── main.jsx
```

---

## 🔐 Authentication Flow

1. User logs in via **Firebase Auth**
2. Firebase ID token is retrieved
3. Token is sent to backend
4. Backend issues a **JWT**
5. JWT is stored and attached via Axios interceptor
6. Protected routes verify role & token

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## ▶️ Run Locally

```bash
# install dependencies
npm install

# start development server
npm run dev
```

---

## 🔒 Route Protection

* `PrivateRoute` → Authenticated users only
* `AdminRoute` → Admin-only access
* `LibrarianRoute` → Librarian-only access

---

## 📦 API Integration

* Axios instance with JWT interceptor
* Auto logout on 401 / 403 response
* RESTful API communication

---

## 📌 Future Improvements

* 🔍 Search & filter books
* ⭐ Book ratings & reviews
* 📊 Admin analytics dashboard
* 🧾 Order invoice generation

---

## 👨‍🎓 Author

**BookCourier**
Built as a full-stack MERN project with role-based authentication.

---