# 📝 Blog Admin Panel — PR_8-Categories

## Project Overview

**PR_8-Categories** is a comprehensive **Blog Admin Panel** application built with **Node.js** and **Express**. It provides a complete content management system with full CRUD operations for blogs, categories, subcategories, and admin users. The application features robust authentication using Passport.js, MongoDB database integration, and a user-friendly EJS-based interface with Bootstrap styling.

---

## 🎯 Key Features

- **👤 Admin Management**: Create, read, update, and delete admin users with profile images
- **🔐 Authentication System**: Secure login/register with password hashing using bcrypt
- **🔑 Password Management**: Forgot password and password reset functionality with OTP verification
- **📚 Blog Management**: Full CRUD operations for blog posts with image uploads
- **📂 Category Management**: Create and manage blog categories with image uploads
- **🏷️ Subcategory Management**: Nested subcategories with cascade deletion
- **📤 File Upload**: Multer-based image upload system for adminsmen, blogs, and categories
- **📧 Email Integration**: Nodemailer for sending verification emails and password reset links
- **💾 Database**: MongoDB integration with Mongoose ODM
- **🎨 Frontend**: EJS templating engine with Bootstrap and jQuery UI components

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Backend Framework** | Express.js 5.2.1 |
| **Database** | MongoDB (with Mongoose 9.2.1) |
| **Authentication** | Passport.js with Local Strategy |
| **Templating** | EJS 4.0.1 |
| **File Upload** | Multer 2.0.2 |
| **Email Service** | Nodemailer 8.0.1 |
| **Password Hashing** | bcrypt 6.0.0 |
| **OTP Generation** | otp-generator 4.0.1 |
| **Session Management** | express-session 1.19.0 |
| **Frontend Libraries** | Bootstrap, jQuery, DataTables, Chart.js, Quill Editor |
| **Dev Tool** | Nodemon (auto-restart on file changes) |

---

## 📁 Complete Project Structure

```
PR_8-Categories/
│
├── 📄 server.js                        # Main application entry point
├── 📄 package.json                     # Project dependencies and scripts
├── 📄 README.md                        # Project README
├── 📄 PROJECT_DOCUMENTATION.md         # This file - Complete project documentation
│
├── 📁 config/
│   └── dbConnection.js                 # MongoDB connection configuration
│
├── 📁 controller/                      # Business Logic Layer
│   ├── admin.controller.js             # Admin CRUD operations (create, read, update, delete)
│   ├── auth.controller.js              # Authentication (login, register, password reset)
│   ├── blog.controller.js              # Blog CRUD with category/subcategory integration
│   ├── category.controller.js          # Category CRUD with cascade subcategory deletion
│   └── subcategory.controller.js       # Subcategory CRUD with API endpoints for cascading dropdowns
│
├── 📁 middleware/                      # Middleware Layer
│   ├── nodemailer.js                   # Email service configuration
│   ├── passport-local-strategy.js      # Passport.js local authentication strategy
│   ├── uploadBlogImage.multer.js       # Multer configuration for blog image uploads
│   └── uploadImage.multer.js           # Multer configuration for admin/category image uploads
│
├── 📁 model/                           # Database Schemas
│   ├── admin.model.js                  # Admin schema (firstname, lastname, email, password, gender, mobileNo, profileImage)
│   ├── blog.model.js                   # Blog schema (already included as model.schema.js)
│   ├── model.schema.js                 # Blog schema (title, author, description, category, subcategory, publishDate, images)
│   ├── category.model.js               # Category schema (name, description, image)
│   └── subcategory.model.js            # Subcategory schema (name, category reference, image)
│
├── 📁 routes/                          # Routing Layer
│   ├── index.routes.js                 # Main router - mounts all route modules
│   ├── auth.routes.js                  # Authentication routes (/login, /register, /forgot-password, etc.)
│   ├── admin.routes.js                 # Admin routes (/view, /add, /edit, /delete)
│   ├── blog.routes.js                  # Blog routes (/view, /add, /edit, /delete)
│   ├── category.routes.js              # Category routes (/view, /add, /edit, /delete)
│   └── subcategory.routes.js           # Subcategory routes (/view, /add, /edit, /delete + API)
│
├── 📁 public/                          # Static Assets
│   ├── assets/
│   │   ├── extra-libs/
│   │   │   ├── calendar/
│   │   │   │   └── calendar.css
│   │   │   ├── DataTables/
│   │   │   │   ├── datatables.css
│   │   │   │   ├── datatables.js
│   │   │   │   ├── datatables.min.css
│   │   │   │   ├── datatables.min.js
│   │   │   │   └── DataTables-1.10.16/  # Legacy DataTables version
│   │   │   ├── gritter/                 # Toast notification library
│   │   │   │   ├── jquery.gritter.css
│   │   │   │   └── jquery.gritter.min.js
│   │   │   ├── multicheck/              # Checkbox utilities
│   │   │   │   ├── datatable-checkbox-init.js
│   │   │   │   ├── jquery.multicheck.js
│   │   │   │   └── multicheck.css
│   │   │   └── sparkline/               # Sparkline charts
│   │   │       └── sparkline.js
│   │   │
│   │   └── images/
│   │       ├── background/              # Background images
│   │       ├── big/                     # Large images
│   │       └── users/                   # User profile images
│   │
│   └── libs/                            # Third-party libraries
│       ├── bootstrap/                   # Bootstrap CSS framework
│       ├── bootstrap-datepicker/        # Date picker plugin
│       ├── chart/                       # Chart.js and dependencies
│       │   ├── chart.js
│       │   ├── excanvas.min.js
│       │   ├── jquery.flot.min.js
│       │   ├── jquery.flot.pie.min.js
│       │   ├── jquery.flot.resize.min.js
│       │   ├── jquery.peity.min.js
│       │   ├── jquery.ui.custom.js
│       │   └── matrix.charts.js
│       ├── datatables/                  # DataTables library
│       ├── datatables.net-bs4/          # DataTables Bootstrap integration
│       ├── flot/                        # Flot charting library
│       ├── flot.tooltip/                # Flot tooltip plugin
│       ├── fullcalendar/                # Full calendar widget
│       ├── inputmask/                   # Input masking plugin
│       ├── jquery/                      # jQuery library
│       ├── jquery-asColor/              # jQuery color utility
│       ├── jquery-asColorPicker/        # jQuery color picker
│       ├── jquery-asGradient/           # jQuery gradient utility
│       ├── jquery-minicolors/           # jQuery mini color picker
│       ├── jquery-steps/                # jQuery step wizard
│       ├── jquery-validation/           # jQuery form validation
│       ├── jquery.flot.tooltip/         # Flot tooltip plugin (duplicate)
│       ├── magnific-popup/              # Light box / modal popup
│       ├── moment/                      # Date and time formatting
│       ├── perfect-scrollbar/           # Custom scrollbar
│       ├── popper.js/                   # Tooltip positioning library
│       ├── quill/                       # Rich text editor
│       ├── select2/                     # Advanced select component
│       └── toastr/                      # Toast notification library
│
├── 📁 views/                           # EJS Template Files
│   ├── dashboard.ejs                   # Main dashboard page
│   ├── header.ejs                      # Common header component
│   ├── footer.ejs                      # Common footer component
│   ├── myProfile.ejs                   # Admin profile view
│   │
│   ├── admin/                          # Admin management templates
│   │   ├── addAdmin.ejs                # Add new admin form
│   │   ├── editAdmin.ejs               # Edit existing admin form
│   │   ├── viewAdmin.ejs               # List all admins
│   │   └── singleView.ejs              # View single admin details
│   │
│   ├── auth/                           # Authentication templates
│   │   ├── loginPage.ejs               # Login form
│   │   ├── register.ejs                # Registration form
│   │   ├── changePassWord.ejs          # Change password form
│   │   ├── forgotPassword.ejs          # Forgot password form
│   │   ├── resetPassword.ejs           # Password reset form
│   │   └── verifyOtp.ejs               # OTP verification form
│   │
│   ├── blog/                           # Blog management templates
│   │   ├── addBlog.ejs                 # Add new blog post form
│   │   ├── editBlog.ejs                # Edit existing blog form
│   │   ├── viewBlog.ejs                # List all blog posts
│   │   └── singleView.ejs              # View single blog post details
│   │
│   ├── category/                       # Category management templates
│   │   ├── addCategory.ejs             # Add new category form
│   │   ├── editCategory.ejs            # Edit category form
│   │   ├── viewCategory.ejs            # List all categories
│   │   └── singleView.ejs              # View single category details
│   │
│   └── subcategory/                    # Subcategory management templates
│       ├── addSubcategory.ejs          # Add new subcategory form
│       ├── editSubcategory.ejs         # Edit subcategory form
│       ├── viewSubcategory.ejs         # List all subcategories
│       └── singleView.ejs              # View single subcategory details
│
├── 📁 uploads/                         # User uploaded files
│   └── [dynamically created folders for images]
│
└── 📁 node_modules/                    # Installed dependencies (not included in repo)
```

---

## 💾 Database Models

### 1. **Admin Model** (`model/admin.model.js`)

```
Admin
├── firstname (String)          # Admin's first name
├── lastname (String)           # Admin's last name
├── email (String)              # Unique email address
├── password (String)           # Bcrypt hashed password
├── gender (Enum)               # 'Male' or 'Female'
├── mobileNo (String)           # Phone number
└── profileImage (String)       # Path to profile image
```

### 2. **Blog Model** (`model/model.schema.js`)

```
Blog
├── title (String)              # Blog post title
├── authorname (String)         # Author's name
├── authorImage (String)        # Author's profile image
├── description (String)        # Blog content/description
├── publishDate (Date)          # Publication date
├── category (String)           # Associated category name
├── subcategory (String)        # Associated subcategory name
└── blogImage (String)          # Featured blog image
```

### 3. **Category Model** (`model/category.model.js`)

```
Category
├── name (String)               # Category name
├── description (String)        # Category description
└── image (String)              # Category image/icon
```

### 4. **Subcategory Model** (`model/subcategory.model.js`)

```
Subcategory
├── name (String)               # Subcategory name
├── category (ObjectId)         # Reference to parent Category
└── image (String)              # Subcategory image
```

---

## 🔗 API Routes & Endpoints

### **Authentication Routes** (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/login` | Display login page |
| POST | `/login` | Process login submission |
| GET | `/register` | Display registration page |
| POST | `/register` | Process new admin registration |
| GET | `/changePassword` | Change password form |
| POST | `/changePassword` | Update admin password |
| GET | `/forgotPassword` | Forgot password page |
| POST | `/forgotPassword` | Send password reset email |
| GET | `/resetPassword` | Reset password form |
| POST | `/resetPassword` | Process password reset |
| POST | `/verifyOtp` | Verify OTP for password reset |
| GET | `/logout` | Logout current admin |

### **Admin Routes** (`/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/view` | Display all admins list |
| GET | `/add` | Display add admin form |
| POST | `/add` | Create new admin |
| GET | `/edit/:id` | Display edit admin form |
| POST | `/edit/:id` | Update admin details |
| GET | `/delete/:id` | Delete admin by ID |
| GET | `/view/:id` | View single admin details |

### **Blog Routes** (`/blog`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/view` | Display all blog posts |
| GET | `/add` | Display add blog form |
| POST | `/add` | Create new blog post |
| GET | `/edit/:id` | Display edit blog form |
| POST | `/edit/:id` | Update blog post |
| GET | `/delete/:id` | Delete blog post |
| GET | `/view/:id` | View single blog post details |

### **Category Routes** (`/category`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/view` | Display all categories |
| GET | `/add` | Display add category form |
| POST | `/add` | Create new category |
| GET | `/edit/:id` | Display edit category form |
| POST | `/edit/:id` | Update category |
| GET | `/delete/:id` | Delete category (cascade delete subcategories) |
| GET | `/view/:id` | View single category details |

### **Subcategory Routes** (`/subcategory`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/view` | Display all subcategories |
| GET | `/add` | Display add subcategory form |
| POST | `/add` | Create new subcategory |
| GET | `/edit/:id` | Display edit subcategory form |
| POST | `/edit/:id` | Update subcategory |
| GET | `/delete/:id` | Delete subcategory |
| GET | `/view/:id` | View single subcategory details |
| GET | `/api/getSubcategories/:categoryId` | API endpoint for cascading dropdown |

---

## 🔐 Authentication Flow

```
1. User accesses /login page
   ↓
2. Submit credentials (email + password)
   ↓
3. Passport.js LocalStrategy validates credentials
   ↓
4. Bcrypt compares hashed password with stored password
   ↓
5. Session created if credentials match
   ↓
6. User redirected to dashboard with authenticated session
```

---

## 📸 File Upload System

### **Image Upload Configurations**

**Blog Images** (`middleware/uploadBlogImage.multer.js`)
- Destination: `/uploads/blogs`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`
- File size limit: Configurable in multer setup

**Admin/Category Images** (`middleware/uploadImage.multer.js`)
- Destination: `/uploads/images`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`
- File size limit: Configurable in multer setup

---

## 📧 Email Integration

**Nodemailer Configuration** (`middleware/nodemailer.js`)

The application uses Nodemailer for:
- Email verification during registration
- Password reset link generation and delivery
- OTP generation and email delivery
- Account confirmation emails

---

## 🎨 Frontend Components

### **UI Frameworks & Libraries**
- **Bootstrap 4+** - Responsive CSS framework
- **jQuery** - DOM manipulation and utilities
- **DataTables** - Advanced data table plugin with sorting, filtering, pagination
- **Chart.js** - Data visualization and charts
- **Quill Editor** - Rich text editor for blog content
- **Select2** - Enhanced select boxes with search
- **Moment.js** - Date and time formatting
- **Toastr** - Toast notification system
- **Magnific Popup** - Light box/modal functionality
- **jQuery Validation** - Form validation
- **Bootstrap Datepicker** - Date selection widget

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v14+)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### **Steps**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PR_8-Categories
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (create `.env` file)
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=8000
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

4. **Start the application**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   - Open browser and navigate to `http://localhost:8000`
   - Default login page displays at `/login`

---

## 📋 Key Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.2.1 | Web application framework |
| mongoose | 9.2.1 | MongoDB object modeling |
| passport | 0.7.0 | Authentication middleware |
| passport-local | 1.0.0 | Local strategy for authentication |
| bcrypt | 6.0.0 | Password hashing |
| ejs | 4.0.1 | Template engine |
| multer | 2.0.2 | File upload handling |
| nodemailer | 8.0.1 | Email sending |
| otp-generator | 4.0.1 | OTP generation |
| express-session | 1.19.0 | Session management |
| cookie-parser | 1.4.7 | Cookie parsing |
| nodemon | 3.1.11 | Development tool for auto-reload |

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────┐
│                   USER INTERFACE                     │
│         (EJS Templates in views/ folder)             │
└────────────────┬────────────────────────────────────┘
                 │ HTTP Requests
                 ↓
┌─────────────────────────────────────────────────────┐
│              ROUTING LAYER (routes/)                 │
│  Handles incoming requests and maps to controllers   │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│         MIDDLEWARE LAYER (middleware/)               │
│  - Authentication (Passport.js)                      │
│  - File uploads (Multer)                            │
│  - Email service (Nodemailer)                       │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│       BUSINESS LOGIC LAYER (controller/)             │
│  - Admin management                                 │
│  - Blog CRUD operations                            │
│  - Category management                              │
│  - Subcategory management                          │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│          DATA PERSISTENCE (model/)                   │
│  - MongoDB schemas                                  │
│  - Admin, Blog, Category, Subcategory models        │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│            DATABASE (MongoDB)                        │
│  - Data storage and retrieval                       │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Use Cases

1. **Admin Panel** - Multi-admin content management system
2. **Blog Platform** - Create and manage blog posts with categorization
3. **Content Organization** - Organize content with categories and subcategories
4. **Admin Profiles** - Secure admin user management with authentication
5. **Image Management** - Upload and manage images for blogs and profiles

---

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Secure session handling with express-session
- **Authentication**: Passport.js with local strategy
- **OTP Verification**: One-time passwords for password recovery
- **Email Verification**: Nodemailer for account verification

---

## 📝 Notes

- This project uses **EJS** as the templating engine
- MongoDB collections are auto-created by Mongoose if they don't exist
- Image uploads are stored in the `/uploads` directory and served as static files
- Sessions expire after 24 hours (configurable in server.js)
- Password reset tokens are sent via email with OTP verification

---

## 📅 Version Information

- **Project Name**: PR_8-Categories
- **Version**: 1.0.0
- **License**: ISC
- **Type**: CommonJS modules

---

**Last Updated**: March 2026
**Created for**: Blog Admin Panel Project
