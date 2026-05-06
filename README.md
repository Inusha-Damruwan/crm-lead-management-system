# 🚀 CRM Lead Management System

A modern, full-stack CRM application built with React, Node.js/Express, and MongoDB. Designed for managing sales leads with authentication, dashboard analytics, and CRUD operations.

## 📋 Project Structure

```
crm-project/
├── client/                          # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                     # API communication
│   │   │   └── index.js             # Axios instance & API methods
│   │   ├── components/              # Reusable components
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   └── ProtectedRoute.jsx   # Route protection wrapper
│   │   ├── context/                 # Global state management
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Dashboard.jsx        # Dashboard with stats
│   │   │   ├── Leads.jsx            # Leads list with filters
│   │   │   └── LeadDetail.jsx       # Lead detail & edit page
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── index.html                   # HTML template
│   ├── package.json
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS config
│   ├── .env                         # Environment variables
│   └── .gitignore
│
├── server/                          # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── Lead.js              # Lead schema
│   │   │   └── Note.js              # Note schema
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   └── leadController.js    # Lead CRUD logic
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   └── leadRoutes.js        # Lead endpoints
│   │   └── index.js                 # Express server
│   ├── package.json
│   ├── .env                         # Environment variables
│   └── .gitignore
```

## 🎯 Features

### Authentication
- ✅ User registration and login
- ✅ JWT token-based authentication
- ✅ Protected routes
- ✅ Test user credentials provided

### Dashboard
- ✅ Total leads count
- ✅ New leads count
- ✅ Qualified leads count
- ✅ Won deals count
- ✅ Lost deals count
- ✅ Total deal value
- ✅ Won deal value

### Lead Management
- ✅ Create leads
- ✅ View lead details
- ✅ Edit leads
- ✅ Delete leads
- ✅ Update lead status

### Search & Filtering
- ✅ Search by name, company, email
- ✅ Filter by status
- ✅ Filter by lead source
- ✅ Filter by assigned salesperson

### Notes System
- ✅ Add notes to leads
- ✅ View note history
- ✅ Note timestamps and creator info

### UI/UX
- ✅ Modern, clean design
- ✅ Fully responsive
- ✅ Sidebar navigation
- ✅ Dashboard cards
- ✅ Data tables
- ✅ Modal forms
- ✅ Tailwind CSS styling

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Git

### Installation

#### 1. Clone/Setup Repository
```bash
cd crm-project
```

#### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file and update MongoDB URI
# .env should contain:
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# NODE_ENV=development

# Create a test user (optional)
npm run seed

# Start server
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file (already configured)
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔐 Test Credentials

Use these credentials to test the application:

- **Email**: admin@example.com
- **Password**: password123

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "salesperson"
}

Response: { token, user }
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: { user }
```

### Lead Endpoints

#### Get All Leads
```
GET /api/leads?status=New&source=Website&search=john
Authorization: Bearer <token>

Response: [{ lead }]
```

#### Get Single Lead
```
GET /api/leads/:id
Authorization: Bearer <token>

Response: { lead with notes }
```

#### Create Lead
```
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "company": "ABC Corp",
  "email": "john@abc.com",
  "phone": "555-1234",
  "source": "Website",
  "assignedTo": "userId",
  "dealValue": 50000
}

Response: { message, lead }
```

#### Update Lead
```
PUT /api/leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Qualified",
  "dealValue": 75000
}

Response: { message, lead }
```

#### Delete Lead
```
DELETE /api/leads/:id
Authorization: Bearer <token>

Response: { message }
```

#### Add Note to Lead
```
POST /api/leads/:id/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Customer interested in enterprise plan"
}

Response: { message, note }
```

#### Get Dashboard Stats
```
GET /api/leads/dashboard/stats
Authorization: Bearer <token>

Response: {
  "totalLeads": 25,
  "newLeads": 5,
  "qualifiedLeads": 8,
  "wonLeads": 10,
  "lostLeads": 2,
  "totalDealValue": 500000,
  "wonDealValue": 400000
}
```

## 📊 Database Schemas

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'salesperson']),
  createdAt: Date,
  updatedAt: Date
}
```

### Lead Model
```javascript
{
  name: String (required),
  company: String (required),
  email: String (required),
  phone: String (required),
  source: String (enum: ['Website', 'Email', 'Phone', 'Referral', ...]),
  assignedTo: ObjectId (ref: User),
  status: String (enum: ['New', 'Contacted', 'Qualified', ...]),
  dealValue: Number,
  notes: [ObjectId] (ref: Note),
  createdAt: Date,
  updatedAt: Date
}
```

### Note Model
```javascript
{
  content: String (required),
  lead: ObjectId (ref: Lead, required),
  createdBy: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crm_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Tailwind CSS Customization

Edit `client/tailwind.config.js` to customize colors and theme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
    },
  },
}
```

## 📝 Common Tasks

### Create a New Lead
1. Click "New Lead" button in Leads page
2. Fill in lead details
3. Click "Save"

### Update Lead Status
1. Go to Leads page
2. Click "View" on a lead
3. Click "Edit"
4. Change status dropdown
5. Click "Save"

### Add Notes to Lead
1. Open lead detail page
2. Scroll to Notes section
3. Type note content
4. Click "Add Note"

### Filter Leads
1. Go to Leads page
2. Use search, status, and source filters
3. Click "Reset Filters" to clear

## 🚨 Error Handling

The application includes comprehensive error handling:
- Network errors are caught and displayed
- Form validation on client and server
- JWT token expiration handling
- Protected routes redirect to login
- Loading states during API calls

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Protected API routes
- ✅ CORS enabled
- ✅ Environment variables for sensitive data
- ✅ Input validation

## 📈 Performance Optimizations

- ✅ Lazy loading routes
- ✅ Optimized components
- ✅ Efficient API calls
- ✅ Vite for fast development
- ✅ CSS modules with Tailwind

## 🐛 Debugging

### Backend Debugging
```bash
# Check MongoDB connection
# Check JWT token in Authorization header
# Use console.log() in controllers
# Check .env file is correct
```

### Frontend Debugging
```bash
# Open browser DevTools (F12)
# Check Network tab for API calls
# Check Console for errors
# Check if token is in localStorage
```

## 📝 Notes

- **Default Port**: Backend runs on 5000, Frontend on 3000
- **MongoDB**: Create free account at https://www.mongodb.com/atlas
- **JWT Secret**: Change in production
- **CORS**: Configured to allow localhost:3000
- **Token Expiry**: Set to 7 days

## 🤝 Contributing

Feel free to extend this project with:
- Export to CSV functionality
- Email notifications
- Advanced reporting
- Multi-user team assignments
- Activity timeline
- Custom fields

## 📞 Support

For issues or questions:
1. Check the error message in console
2. Verify MongoDB connection
3. Ensure .env files are correct
4. Check that both servers are running

## 📄 License

This project is open source and available for learning purposes.

---

**Happy Coding! 🎉**
