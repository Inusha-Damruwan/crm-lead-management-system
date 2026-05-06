# 🚀 CRM Lead Management System

A modern full-stack CRM Lead Management System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).  
This application helps businesses manage sales leads, track deal progress, and organize customer interactions efficiently.

---

# 🌟 Features

## 🔐 Authentication
- User Login Authentication
- JWT Token Authentication
- Protected Routes
- Persistent Login Sessions

---

## 📊 Dashboard
- Total Leads Count
- New Leads
- Qualified Leads
- Won Deals
- Lost Deals
- Contacted Leads
- Total Deal Value
- Won Deal Value
- Quick Statistics Cards

---

## 👥 Lead Management
- Create New Leads
- View Lead Details
- Edit Lead Information
- Delete Leads
- Lead Status Management
- Assign Salesperson
- Deal Value Tracking

---

## 🔎 Search & Filtering
- Search by Name
- Search by Email
- Search by Company
- Filter by Status
- Filter by Lead Source
- Filter by Assigned Salesperson

---

## 📝 Notes System
- Add Notes to Leads
- View Lead Notes
- Track Customer Communication

---

## 🎨 UI/UX
- Modern Responsive Design
- Gradient Sidebar
- Professional Dashboard Layout
- Responsive Mobile Support
- Smooth User Experience
- Tailwind CSS Styling

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

# 📁 Project Structure

```bash
crm-lead-management-system/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   │
│   ├── scripts/
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── README.md
└── package.json
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Inusha-Damruwan/crm-lead-management-system.git
cd crm-lead-management-system
```

---

# 🔧 Backend Setup

```bash
cd server
npm install
```

Create `.env` file inside `server/`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend server:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 🗄️ Database Setup

1. Create MongoDB Atlas Account
2. Create New Cluster
3. Copy MongoDB Connection String
4. Add Connection String to `.env`
5. Start Backend Server

⚠️ Do not upload real `.env` files to GitHub.

---

# 🔐 Test Login Credentials

```bash
Email: admin@example.com
Password: password123
```

---

# 📚 API Endpoints

## Authentication

### Login

```http
POST /api/auth/login
```

### Get Current User

```http
GET /api/auth/me
```

---

## Leads

### Get All Leads

```http
GET /api/leads
```

### Get Single Lead

```http
GET /api/leads/:id
```

### Create Lead

```http
POST /api/leads
```

### Update Lead

```http
PUT /api/leads/:id
```

### Delete Lead

```http
DELETE /api/leads/:id
```

### Add Note

```http
POST /api/leads/:id/notes
```

---

# 📊 Database Models

## User Model

```js
{
  name,
  email,
  password,
  role
}
```

## Lead Model

```js
{
  name,
  company,
  email,
  phone,
  source,
  assignedTo,
  status,
  dealValue
}
```

## Note Model

```js
{
  content,
  lead,
  createdBy
}
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- Protected Routes
- Secure API Access
- Environment Variables Protection

---

# 📈 Performance Features

- Fast React Rendering
- Optimized API Calls
- Responsive UI
- Modern Component Structure
- Clean Code Architecture

---



# 📝 Reflection Note

This project helped improve my full-stack development skills using the MERN stack.  
I learned authentication, CRUD operations, protected routing, responsive UI design, MongoDB database handling, API development, and frontend-backend integration.

---



# 👨‍💻 Developer

### Inusha Damruwan

- ICT Undergraduate
- Rajarata University of Sri Lanka

---

# 🎉 Thank You

Thank you for reviewing this project.
