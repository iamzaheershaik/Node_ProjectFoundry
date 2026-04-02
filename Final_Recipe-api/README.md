# 🍽️ Recipe Sharing API

A beginner-friendly REST API built with **Node.js, Express, MongoDB, and JWT**.

---

## 📁 Project Structure

```
recipe-api/
├── models/
│   ├── User.js          ← User schema (username, email, password, role)
│   ├── Recipe.js        ← Recipe schema (title, ingredients, instructions)
│   └── Comment.js       ← Comment schema (text, recipe ref, user ref)
├── controllers/
│   ├── authController.js    ← register / login / logout
│   ├── recipeController.js  ← CRUD for recipes
│   ├── commentController.js ← add / get / delete comments
│   └── userController.js    ← "my recipes"
├── routes/
│   ├── authRoutes.js
│   ├── recipeRoutes.js
│   ├── commentRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── authMiddleware.js  ← verifies JWT token
│   └── roleMiddleware.js  ← checks admin role
├── .env.example
├── package.json
└── server.js             ← Entry point
```

---

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create your .env file
```bash
cp .env.example .env
# Then edit .env and fill in your values
```

### 3. Start the server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

---

## 🔐 Authentication

Send the token in the **Authorization header** for protected routes:

```
Authorization: Bearer <your_token_here>
```

---

## 📋 API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Create account |
| POST | /api/auth/login | Public | Login & get token |
| POST | /api/auth/logout | Protected | Logout |

**Register body:**
```json
{
  "username": "zaheer",
  "email": "zaheer@email.com",
  "password": "secret123"
}
```

**Login body:**
```json
{
  "email": "zaheer@email.com",
  "password": "secret123"
}
```

---

### Recipes
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | /api/recipes | Public | Get all recipes (paginated) |
| GET | /api/recipes/:id | Public | Get one recipe |
| POST | /api/recipes | Protected | Create recipe |
| PUT | /api/recipes/:id | Protected (owner/admin) | Update recipe |
| DELETE | /api/recipes/:id | Protected (owner/admin) | Delete recipe |

**Pagination:** `/api/recipes?page=1&limit=10`

**Create/Update body:**
```json
{
  "title": "Biryani",
  "ingredients": ["Rice", "Chicken", "Spices"],
  "instructions": "Cook on low heat for 30 minutes."
}
```

---

### Comments
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/comments/:recipeId | Protected | Add comment |
| GET | /api/comments/:recipeId | Public | Get all comments |
| DELETE | /api/comments/:id | Protected (owner/admin) | Delete comment |

**Comment body:**
```json
{
  "text": "This recipe is amazing!"
}
```

---

### User
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | /api/users/me/recipes | Protected | My recipes only |

---

## 👤 Roles

| Role | Can Do |
|------|--------|
| `user` (default) | Create, update, delete **their own** recipes and comments |
| `admin` | Do everything + delete **anyone's** recipes and comments |

> To make a user admin, update their `role` field in MongoDB directly (or build an admin route).
