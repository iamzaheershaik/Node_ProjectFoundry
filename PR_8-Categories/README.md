# 📝 Blog Admin Panel — PR_8-Categories

A full-featured **Blog Admin Panel** built with Node.js, Express, MongoDB, and EJS. Includes CRUD for **Blogs**, **Categories**, **Subcategories**, and **Admins** with Passport.js authentication and image upload support.

---

## 📁 Project Structure

```
PR_8-Categories/
├── config/
│   └── dbConnection.js               # MongoDB connection setup
│
├── controller/
│   ├── admin.controller.js            # Admin CRUD operations
│   ├── auth.controller.js             # Login, Register, Password Reset
│   ├── blog.controller.js             # Blog CRUD + category/subcategory integration
│   ├── category.controller.js         # Category CRUD + cascade delete subcategories
│   └── subcategory.controller.js      # Subcategory CRUD + API for cascading dropdown
│
├── middleware/
│   ├── passport-local-strategy.js     # Passport.js authentication strategy
│   ├── uploadBlogImage.multer.js      # Multer config for blog images
│   └── uploadImage.multer.js          # Multer config for admin/category images
│
├── model/
│   ├── admin.model.js                 # Admin schema (name, email, password, etc.)
│   ├── category.model.js              # Category schema (name, description, image)
│   ├── model.schema.js                # Blog schema (title, category, subcategory, etc.)
│   └── subcategory.model.js           # Subcategory schema (name, category ref, image)
│
├── routes/
│   ├── admin.routes.js                # /admin routes
│   ├── auth.routes.js                 # /auth routes (login, register, etc.)
│   ├── blog.routes.js                 # /blog routes
│   ├── category.routes.js             # /category routes
│   ├── index.routes.js                # Main router — mounts all route modules
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
│   │   ├── addBlog.ejs                # Blog form with cascading category → subcategory dropdown
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
│   ├── subcategory/
│   │   ├── addSubcategory.ejs         # Dropdown to pick parent category
│   │   ├── editSubcategory.ejs
│   │   ├── singleView.ejs             # Shows parent category name
│   │   └── viewSubcategory.ejs        # Shows parent category for each
│   │
│   ├── dashboard.ejs                  # Quick actions for Blog, Category, Subcategory
│   ├── footer.ejs
│   ├── header.ejs                     # Sidebar with Blog, Category, Subcategory nav
│   └── myProfile.ejs
│
├── public/                            # Static assets (CSS, JS, images, fonts)
│   ├── assets/                        # Third-party libs (jQuery, Bootstrap, Toastr, etc.)
│   └── dist/                          # App styles, icons, and scripts
│
├── uploads/                           # Uploaded images (blog, category, subcategory, admin)
│
├── server.js                          # Express app entry point
├── package.json
└── README.md
```

---

## 🛠 Tech Stack

| Technology    | Purpose                          |
|---------------|----------------------------------|
| **Node.js**   | Server runtime                   |
| **Express.js**| Web framework                    |
| **MongoDB**   | NoSQL database                   |
| **Mongoose**  | MongoDB ODM                      |
| **EJS**       | Templating engine                |
| **Passport.js** | Authentication (Local Strategy)|
| **Multer**    | File/image uploads               |
| **bcrypt**    | Password hashing                 |
| **express-session** | Session management         |
| **Toastr**    | Flash notifications              |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd PR_8-Categories

# Install dependencies
npm install

# Start development server
npm run dev
```

The server runs on **http://localhost:8080** (or your configured port).

---

## 📋 Features

### Blog Management
- Full CRUD for blog posts with image upload
- Dynamic **Category** and **Subcategory** dropdowns (cascading)
- Search by title, author, category, or description

### Category Management
- Full CRUD for categories with image upload
- **Subcategory count** displayed in the list view
- **Related subcategories** shown in single category view
- **Cascade delete** — deleting a category removes all its subcategories

### Subcategory Management
- Full CRUD with parent category reference (`ObjectId` → `Category`)
- Parent category shown in all views
- **JSON API** endpoint: `GET /subcategory/api/by-category/:categoryId`

### Admin Management
- Full CRUD for admin users with profile image
- Password hashing with bcrypt

### Authentication
- Login / Register with Passport.js local strategy
- Change Password / Forgot Password / OTP Verification

---

## 🔗 Schema Relationships

```
Category (1) ──────── (∞) Subcategory
   │                         │
   │ name (string)           │ category (ObjectId ref → Category)
   │                         │
   └── referenced by ──────► Blog.category (string)
                              Blog.subcategory (string)
```

---

## 📡 API Endpoints

| Method | Route                                    | Description                    |
|--------|------------------------------------------|--------------------------------|
| GET    | `/blog/view`                             | View all blogs                 |
| GET    | `/blog/add`                              | Add blog form                  |
| POST   | `/blog/add`                              | Create blog                    |
| GET    | `/blog/view/:id`                         | View single blog               |
| GET    | `/blog/edit/:id`                         | Edit blog form                 |
| POST   | `/blog/edit/:id`                         | Update blog                    |
| GET    | `/blog/delete/:id`                       | Delete blog                    |
| GET    | `/category/view`                         | View all categories            |
| GET    | `/category/add`                          | Add category form              |
| POST   | `/category/add`                          | Create category                |
| GET    | `/category/view/:id`                     | View single category           |
| GET    | `/category/edit/:id`                     | Edit category form             |
| POST   | `/category/edit/:id`                     | Update category                |
| GET    | `/category/delete/:id`                   | Delete category (+ subcats)    |
| GET    | `/subcategory/view`                      | View all subcategories         |
| GET    | `/subcategory/add`                       | Add subcategory form           |
| POST   | `/subcategory/add`                       | Create subcategory             |
| GET    | `/subcategory/view/:id`                  | View single subcategory        |
| GET    | `/subcategory/edit/:id`                  | Edit subcategory form          |
| POST   | `/subcategory/edit/:id`                  | Update subcategory             |
| GET    | `/subcategory/delete/:id`                | Delete subcategory             |
| GET    | `/subcategory/api/by-category/:catId`    | **JSON API** — subcats by category |

---

## 🧩 MVC Pattern

The project follows a strict **Model-View-Controller** architecture:

- **Model** → Mongoose schemas in `/model/`
- **View** → EJS templates in `/views/`
- **Controller** → Business logic in `/controller/`
- **Routes** → Express routers in `/routes/`
- **Middleware** → Auth & uploads in `/middleware/`
