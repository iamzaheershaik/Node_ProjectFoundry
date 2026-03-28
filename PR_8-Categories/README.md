# 📝 Blog & Product Admin Panel — PR_8-Categories

A full-featured **Admin Panel** built with Node.js, Express, MongoDB, and EJS. Includes complete CRUD for **Blogs**, **Categories**, **Subcategories**, **Extracategories**, **Products**, and **Admins** — with Passport.js authentication, OTP-based password recovery, and image upload support.

---

## 📁 Project Structure

```
PR_8-Categories/
├── config/
│   └── dbConnection.js                # MongoDB Atlas connection setup
│
├── controller/
│   ├── admin.controller.js            # Admin CRUD operations
│   ├── auth.controller.js             # Login, Register, Password Reset, OTP
│   ├── blog.controller.js             # Blog CRUD + category/subcategory integration
│   ├── category.controller.js         # Category CRUD + cascade delete subcategories
│   ├── extracategory.controller.js    # Extracategory CRUD + API for cascading dropdown
│   ├── product.controller.js          # Product CRUD (linked to all 3 category levels)
│   └── subcategory.controller.js      # Subcategory CRUD + API for cascading dropdown
│
├── middleware/
│   ├── nodemailer.js                  # Email transporter for OTP/password reset
│   ├── passport-local-strategy.js     # Passport.js local strategy + auth guards
│   ├── uploadBlogImage.multer.js      # Multer config for blog images
│   └── uploadImage.multer.js          # Multer config for admin/category/product images
│
├── model/
│   ├── admin.model.js                 # Admin schema (name, email, password, gender, etc.)
│   ├── category.model.js              # Category schema (name, description, image)
│   ├── extracategory.model.js         # Extracategory schema (name, subcategory ref, image)
│   ├── model.schema.js                # Blog schema (title, category, subcategory, etc.)
│   ├── product.model.js               # Product schema (name, price, quantity, 3-level refs)
│   └── subcategory.model.js           # Subcategory schema (name, category ref, image)
│
├── routes/
│   ├── admin.routes.js                # /admin routes
│   ├── auth.routes.js                 # / routes (login, register, forgot password)
│   ├── blog.routes.js                 # /blog routes
│   ├── category.routes.js             # /category routes
│   ├── extracategory.routes.js        # /extracategory routes + API endpoint
│   ├── index.routes.js                # Main router — mounts all route modules
│   ├── product.routes.js              # /product routes
│   └── subcategory.routes.js          # /subcategory routes + API endpoint
│
├── views/
│   ├── admin/
│   │   ├── addAdmin.ejs
│   │   ├── editAdmin.ejs
│   │   ├── singleView.ejs
│   │   └── viewAdmin.ejs
│   │
│   ├── auth/
│   │   ├── changePassWord.ejs
│   │   ├── forgotPassword.ejs
│   │   ├── loginPage.ejs
│   │   ├── register.ejs
│   │   ├── resetPassword.ejs
│   │   └── verifyOtp.ejs
│   │
│   ├── blog/
│   │   ├── addBlog.ejs                # Blog form with cascading category → subcategory
│   │   ├── editBlog.ejs               # Edit blog with pre-selected subcategory
│   │   ├── singleView.ejs
│   │   └── viewBlog.ejs               # Blog table with subcategory column
│   │
│   ├── category/
│   │   ├── addCategory.ejs
│   │   ├── editCategory.ejs
│   │   ├── singleView.ejs             # Shows related subcategories table
│   │   └── viewCategory.ejs           # Shows subcategory count per category
│   │
│   ├── extracategory/
│   │   ├── addExtracategory.ejs       # Cascading category → subcategory dropdown
│   │   ├── editExtracategory.ejs
│   │   ├── singleView.ejs
│   │   └── viewExtracategory.ejs
│   │
│   ├── product/
│   │   ├── addProduct.ejs             # 3-level cascading dropdown (cat → subcat → extracat)
│   │   ├── editProduct.ejs
│   │   ├── singleView.ejs
│   │   └── viewProduct.ejs
│   │
│   ├── subcategory/
│   │   ├── addSubcategory.ejs         # Dropdown to pick parent category
│   │   ├── editSubcategory.ejs
│   │   ├── singleView.ejs             # Shows parent category name
│   │   └── viewSubcategory.ejs        # Shows parent category for each
│   │
│   ├── partials/
│   │   ├── auth_head.ejs              # HTML head for authentication pages
│   │   ├── auth_footer.ejs            # Footer script for auth pages
│   │   ├── flash_messages.ejs         # Toastr flash message partial
│   │   ├── head.ejs                   # HTML head for dashboard pages
│   │   ├── layout_open.ejs            # Opening layout wrapper (header + sidebar)
│   │   └── layout_close.ejs           # Closing layout wrapper (footer + scripts)
│   │
│   ├── dashboard.ejs                  # Quick-actions for all entities
│   ├── footer.ejs                     # Global footer
│   ├── header.ejs                     # Sidebar with all navigation links
│   └── myProfile.ejs                  # Admin profile page
│
├── public/                            # Static assets (CSS, JS, images, fonts)
│   ├── assets/                        # Third-party libs (jQuery, Bootstrap, Toastr, etc.)
│   └── dist/                          # App styles, icons, and scripts
│
├── uploads/                           # Uploaded images (blog, category, product, admin)
│
├── Markdown/                          # Extra documentation files
│   ├── EXTRACATEGORY_README.md
│   └── PROJECT_DOCUMENTATION.md
│
├── server.js                          # Express app entry point
├── package.json
└── README.md
```

---

## 🛠 Tech Stack

| Technology         | Purpose                              |
|--------------------|--------------------------------------|
| **Node.js**        | Server runtime                       |
| **Express.js v5**  | Web framework                        |
| **MongoDB Atlas**  | Cloud NoSQL database                 |
| **Mongoose v9**    | MongoDB ODM                          |
| **EJS**            | Server-side templating engine        |
| **Passport.js**    | Authentication (Local Strategy)      |
| **Multer**         | File/image uploads                   |
| **bcrypt**         | Password hashing                     |
| **express-session**| Session management                   |
| **Nodemailer**     | Email (OTP / Password Reset)         |
| **otp-generator**  | OTP code generation                  |
| **Toastr**         | Client-side flash notifications      |
| **Bootstrap**      | UI framework (via public/assets)     |
| **jQuery**         | DOM manipulation & AJAX calls        |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (connection string in `config/dbConnection.js`)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd PR_8-Categories

# Install dependencies
npm install

# Start development server (with nodemon)
npm run dev

# Or start production server
npm start
```

The server runs on **http://localhost:8000**.

---

## 📋 Features

### 🗂️ Category Management
- Full CRUD with image upload
- **Subcategory count** displayed in list view
- **Related subcategories** shown in single category view
- **Cascade delete** — deleting a category removes all its subcategories

### 📂 Subcategory Management
- Full CRUD with parent **Category** reference (`ObjectId` → `Category`)
- Parent category shown in all views
- **JSON API endpoint**: `GET /subcategory/api/by-category/:categoryId`

### 📁 Extracategory Management
- Full CRUD with parent **Subcategory** reference (`ObjectId` → `Subcategory`)
- **JSON API endpoint**: `GET /extracategory/api/by-subcategory/:subcategoryId`
- Enables 3-level cascading dropdown: Category → Subcategory → Extracategory

### 🛒 Product Management
- Full CRUD with image upload
- References all 3 category levels (`Category`, `Subcategory`, `Extracategory`)
- Price and quantity fields
- 3-level cascading dropdown in add/edit forms

### ✍️ Blog Management
- Full CRUD for blog posts with image upload
- Dynamic **Category** and **Subcategory** dropdowns (cascading)
- Search by title, author, category, or description

### 👤 Admin Management
- Full CRUD for admin users with profile image
- Password hashing with bcrypt

### 🔐 Authentication
- Login / Register with Passport.js local strategy
- Change Password
- Forgot Password → OTP via Email → Reset Password

---

## 🔗 Schema Relationships

```
Category (1) ──────────── (∞) Subcategory
   │                              │
   │                              ├──── (∞) Extracategory
   │                              │            │
   │                              │            │
   └── All three referenced by ──►├──── (∞) Product
                                  │         (category + subcategory + extracategory refs)
                                  │
                                  └──── Blog (uses category/subcategory as strings)

Admin ←──── Passport.js authentication (standalone, no refs to other models)
```

### Model Hierarchy

| Model           | Key Fields                                    | References                          |
|-----------------|-----------------------------------------------|-------------------------------------|
| **Category**    | name, description, categoryImage              | —                                   |
| **Subcategory** | name, description, subcategoryImage            | `category` → Category               |
| **Extracategory**| name, description, extracategoryImage          | `subcategory` → Subcategory         |
| **Product**     | name, description, productImage, price, quantity| `category` → Cat, `subcategory` → Subcat, `extracategory` → Extracat |
| **Blog**        | title, authorname, authorImage, description, blogImage | category (string), subcategory (string) |
| **Admin**       | firstname, lastname, email, password, gender, mobileNo, profileImage | —          |

---

## 📡 API Endpoints

### Auth Routes (`/`)

| Method | Route                     | Description                    |
|--------|---------------------------|--------------------------------|
| GET    | `/`                       | Login page                     |
| POST   | `/login`                  | Authenticate admin             |
| GET    | `/register`               | Register page                  |
| POST   | `/register`               | Create admin account           |
| GET    | `/dashboard`              | Dashboard (protected)          |
| GET    | `/my-profile`             | Admin profile (protected)      |
| GET    | `/forgot-password`        | Forgot password page           |
| POST   | `/forgot-password`        | Send OTP email                 |
| GET    | `/verify-otp`             | OTP verification page          |
| POST   | `/verify-otp`             | Verify OTP code                |
| GET    | `/reset-password`         | Reset password page            |
| POST   | `/reset-password`         | Set new password               |
| GET    | `/change-password`        | Change password page           |
| POST   | `/change-password`        | Update password                |
| GET    | `/logout`                 | Log out                        |

### Admin Routes (`/admin`)

| Method | Route               | Description                |
|--------|----------------------|----------------------------|
| GET    | `/admin/view`        | View all admins            |
| GET    | `/admin/add`         | Add admin form             |
| POST   | `/admin/add`         | Create admin               |
| GET    | `/admin/view/:id`    | View single admin          |
| GET    | `/admin/edit/:id`    | Edit admin form            |
| POST   | `/admin/edit/:id`    | Update admin               |
| GET    | `/admin/delete/:id`  | Delete admin               |

### Blog Routes (`/blog`)

| Method | Route               | Description                |
|--------|----------------------|----------------------------|
| GET    | `/blog/view`         | View all blogs             |
| GET    | `/blog/add`          | Add blog form              |
| POST   | `/blog/add`          | Create blog                |
| GET    | `/blog/view/:id`     | View single blog           |
| GET    | `/blog/edit/:id`     | Edit blog form             |
| POST   | `/blog/edit/:id`     | Update blog                |
| GET    | `/blog/delete/:id`   | Delete blog                |

### Category Routes (`/category`)

| Method | Route                    | Description                    |
|--------|--------------------------|--------------------------------|
| GET    | `/category/view`         | View all categories            |
| GET    | `/category/add`          | Add category form              |
| POST   | `/category/add`          | Create category                |
| GET    | `/category/view/:id`     | View single category           |
| GET    | `/category/edit/:id`     | Edit category form             |
| POST   | `/category/edit/:id`     | Update category                |
| GET    | `/category/delete/:id`   | Delete category (+ subcats)    |

### Subcategory Routes (`/subcategory`)

| Method | Route                                       | Description                        |
|--------|---------------------------------------------|------------------------------------|
| GET    | `/subcategory/view`                          | View all subcategories             |
| GET    | `/subcategory/add`                           | Add subcategory form               |
| POST   | `/subcategory/add`                           | Create subcategory                 |
| GET    | `/subcategory/view/:id`                      | View single subcategory            |
| GET    | `/subcategory/edit/:id`                      | Edit subcategory form              |
| POST   | `/subcategory/edit/:id`                      | Update subcategory                 |
| GET    | `/subcategory/delete/:id`                    | Delete subcategory                 |
| GET    | `/subcategory/api/by-category/:catId`        | **JSON API** — subcats by category |

### Extracategory Routes (`/extracategory`)

| Method | Route                                              | Description                             |
|--------|----------------------------------------------------|-----------------------------------------|
| GET    | `/extracategory/view`                               | View all extracategories                |
| GET    | `/extracategory/add`                                | Add extracategory form                  |
| POST   | `/extracategory/add`                                | Create extracategory                    |
| GET    | `/extracategory/view/:id`                           | View single extracategory               |
| GET    | `/extracategory/edit/:id`                           | Edit extracategory form                 |
| POST   | `/extracategory/edit/:id`                           | Update extracategory                    |
| GET    | `/extracategory/delete/:id`                         | Delete extracategory                    |
| GET    | `/extracategory/api/by-subcategory/:subcategoryId`  | **JSON API** — extracats by subcategory |

### Product Routes (`/product`)

| Method | Route                  | Description              |
|--------|------------------------|--------------------------|
| GET    | `/product/view`        | View all products        |
| GET    | `/product/add`         | Add product form         |
| POST   | `/product/add`         | Create product           |
| GET    | `/product/view/:id`    | View single product      |
| GET    | `/product/edit/:id`    | Edit product form        |
| POST   | `/product/edit/:id`    | Update product           |
| GET    | `/product/delete/:id`  | Delete product           |

---

## 🧩 MVC Architecture

The project follows a strict **Model-View-Controller** architecture:

| Layer           | Directory        | Purpose                                       |
|-----------------|------------------|-----------------------------------------------|
| **Model**       | `/model/`        | Mongoose schemas & data structure              |
| **View**        | `/views/`        | EJS templates with partials for reuse          |
| **Controller**  | `/controller/`   | Business logic & request handling              |
| **Routes**      | `/routes/`       | Express routers defining URL → Controller maps |
| **Middleware**   | `/middleware/`   | Auth guards, file uploads, email service       |
| **Config**      | `/config/`       | Database connection settings                   |

---

## 🔄 Request Flow

```
Client Request
    ↓
server.js (Express app)
    ↓
Middleware (session → passport → static files)
    ↓
index.routes.js (central router)
    ↓
Feature routes (blog.routes.js, category.routes.js, etc.)
    ↓
Auth guard (passport.checkAuthenticate)
    ↓
Controller (business logic + DB queries)
    ↓
Model (Mongoose schema + MongoDB)
    ↓
View (EJS template with partials)
    ↓
Response to Client
```

---

## 📧 Email Service

The app uses **Nodemailer** (Gmail SMTP) for:
- Sending OTP codes for password recovery
- Password reset confirmation emails

Configured in `middleware/nodemailer.js`.

---

## 📄 License

ISC
