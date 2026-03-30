# 🧪 Postman Testing Guide — PR_9 REST API

> **Audience:** Complete beginners who have never used Postman before.
> This guide walks you through installing Postman, understanding REST APIs, and testing **every endpoint** in this project step-by-step.

---

## 📑 Table of Contents

1. [What is Postman?](#1-what-is-postman)
2. [Install Postman](#2-install-postman)
3. [Understanding REST API Basics](#3-understanding-rest-api-basics)
4. [Understanding This Project's Role Hierarchy](#4-understanding-this-projects-role-hierarchy)
5. [Getting Started — Create a Collection](#5-getting-started--create-a-collection)
6. [Step-by-Step API Testing](#6-step-by-step-api-testing)
   - [PHASE 1: SuperAdmin](#phase-1-superadmin)
   - [PHASE 2: Admin](#phase-2-admin)
   - [PHASE 3: Manager](#phase-3-manager)
   - [PHASE 4: Employee](#phase-4-employee)
7. [How to Use Authorization Tokens](#7-how-to-use-authorization-tokens)
8. [How to Upload Files (Profile Image)](#8-how-to-upload-files-profile-image)
9. [Common Errors & Troubleshooting](#9-common-errors--troubleshooting)
10. [Tips & Best Practices](#10-tips--best-practices)

---

## 1. What is Postman?

**Postman** is a free tool that lets you send HTTP requests (GET, POST, PUT, DELETE) to your server **without building a frontend**. Think of it as a way to "talk to your API" directly.

| What you do in a browser     | What you do in Postman            |
|------------------------------|-----------------------------------|
| Fill a form and click Submit | Type the data and click **Send**  |
| See a webpage                | See raw JSON data                 |
| Login via a UI               | Send email + password as JSON     |

---

## 2. Install Postman

1. Go to **[https://www.postman.com/downloads/](https://www.postman.com/downloads/)**
2. Download the version for **Windows**
3. Install it (just keep clicking Next)
4. Open Postman — you can **skip the sign‑in** (click "Skip and go to the app" at the bottom)

> 💡 **You can also use the web version** at [https://web.postman.co](https://web.postman.co) but the desktop app is recommended.

---

## 3. Understanding REST API Basics

### What is a URL / Endpoint?

An endpoint is a URL your server listens on. Your server runs on:

```
http://localhost:7092
```

Each endpoint path is added after this. For example:

```
http://localhost:7092/superadmin/register
```

### HTTP Methods (Verbs)

| Method     | Purpose                  | Example                          |
|------------|--------------------------|----------------------------------|
| **GET**    | Retrieve / Read data     | Get profile, View all admins     |
| **POST**   | Create / Send data       | Register, Login, Create user     |
| **PUT**    | Update existing data     | Update profile                   |
| **DELETE** | Delete data              | Delete a user                    |

### What is JSON?

JSON is how we send and receive data. It looks like this:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

### What is a Token?

When you **login**, the server gives you a **JWT token** (a long string). You must include this token in future requests to prove you're authenticated. Think of it as your **digital ID card**.

---

## 4. Understanding This Project's Role Hierarchy

This API has **4 roles** with a strict chain of command:

```
SuperAdmin  (Top Level — creates Admins)
    └── Admin  (creates Managers)
            └── Manager  (creates Employees)
                    └── Employee  (lowest level)
```

### Who can do what?

| Action                | Who Performs It   |
|-----------------------|-------------------|
| Register SuperAdmin   | Anyone (one-time) |
| Create Admin          | SuperAdmin        |
| Create Manager        | Admin             |
| Create Employee       | Manager           |
| Delete Admin          | SuperAdmin        |
| Delete Manager        | Admin             |
| Delete Employee       | Manager           |
| Update own profile    | Each role itself  |
| View own profile      | Each role itself  |

> ⚠️ **Important:** You MUST test in this exact order: SuperAdmin → Admin → Manager → Employee. Each role creates the one below it.

---

## 5. Getting Started — Create a Collection

A **Collection** in Postman is like a folder that groups your requests.

### Steps:

1. Open Postman
2. Click **"Collections"** in the left sidebar
3. Click the **"+"** button (or "New Collection")
4. Name it: **`PR_9 REST API`**
5. Inside this collection, create **4 folders**:
   - `SuperAdmin`
   - `Admin`
   - `Manager`
   - `Employee`

> 💡 Right‑click the collection → **Add Folder** to create sub-folders.

---

## 6. Step-by-Step API Testing

> **Prerequisites:**
> - Your server must be running (`npm run dev`)
> - MongoDB must be connected (check your terminal for "Connected to MongoDB")

---

### PHASE 1: SuperAdmin

#### 1.1 Register SuperAdmin

This is the **very first request** you'll make. It creates the top-level user.

| Setting       | Value                                               |
|---------------|-----------------------------------------------------|
| **Method**    | `POST`                                              |
| **URL**       | `http://localhost:7092/superadmin/register`          |
| **Body Type** | `form-data`                                         |

**Body (form-data tab):**

| KEY             | VALUE                      | TYPE   |
|-----------------|----------------------------|--------|
| `firstName`     | `Zaheer`                   | Text   |
| `lastName`      | `Shaik`                    | Text   |
| `email`         | `superadmin@example.com`   | Text   |
| `password`      | `Super@1234`               | Text   |
| `phoneNo`       | `9876543210`               | Text   |
| `gender`        | `Male`                     | Text   |
| `profileImage`  | *(select a file)*          | **File** |

**How to set the body:**

1. Below the URL bar, click the **"Body"** tab
2. Select **"form-data"** (radio button)
3. Add each key-value pair
4. For `profileImage`, hover over the KEY column → a dropdown appears → change **Text** to **File** → then click **Select Files** to pick an image from your computer
5. Click **Send**

**Expected Response:**
```json
{
  "message": "SuperAdmin registered successfully",
  "superAdmin": {
    "_id": "6...",
    "firstName": "Zaheer",
    "lastName": "Shaik",
    "email": "superadmin@example.com",
    "profileImage": "uploads\\1711792000000.jpg",
    "phoneNo": "9876543210",
    "gender": "Male",
    "role": "superadmin",
    ...
  }
}
```

> 💡 **Without profile image?** Simply leave the `profileImage` row empty or remove it.

---

#### 1.2 Login SuperAdmin

| Setting       | Value                                          |
|---------------|-------------------------------------------------|
| **Method**    | `POST`                                         |
| **URL**       | `http://localhost:7092/superadmin/login`        |
| **Body Type** | `raw` → `JSON`                                 |

**Body (raw JSON):**

```json
{
  "email": "superadmin@example.com",
  "password": "Super@1234"
}
```

**How to set raw JSON body:**

1. Click the **"Body"** tab
2. Select **"raw"** (radio button)
3. In the dropdown to the right that says "Text", change it to **"JSON"**
4. Paste the JSON above
5. Click **Send**

**Auto-save the token (do this once):**

1. Click the **"Scripts"** tab → **"Post-response"**
2. Paste this script:
```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("superAdminToken", response.token);
    console.log("✅ SuperAdmin token saved!");
}
```
3. Click **Save** (Ctrl + S)

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> ✅ The token is **automatically saved** to `{{superAdminToken}}` — no need to copy it!

---

#### 1.3 Get SuperAdmin Profile

| Setting            | Value                                          |
|--------------------|-------------------------------------------------|
| **Method**         | `GET`                                          |
| **URL**            | `http://localhost:7092/superadmin/profile`      |
| **Authorization**  | Bearer Token (see [Section 7](#7-how-to-use-authorization-tokens)) |

**No body needed** — this is a GET request.

**How to add the token:**

1. Click the **"Authorization"** tab (next to Body)
2. In the **"Auth Type"** dropdown, select **"Bearer Token"**
3. In the **Token** field, type: `{{superAdminToken}}`
4. Click **Send**

**Expected Response:**
```json
{
  "_id": "6...",
  "firstName": "Zaheer",
  "lastName": "Shaik",
  "email": "superadmin@example.com",
  "phoneNo": "9876543210",
  "gender": "Male",
  "role": "superadmin",
  ...
}
```

---

### PHASE 2: Admin

> ⚠️ For creating an Admin, you need the **SuperAdmin token** from step 1.2.

#### 2.1 Create Admin (SuperAdmin creates Admin)

| Setting            | Value                                          |
|--------------------|-------------------------------------------------|
| **Method**         | `POST`                                         |
| **URL**            | `http://localhost:7092/admin/create`            |
| **Authorization**  | Bearer Token → **SuperAdmin's token**          |
| **Body Type**      | `form-data`                                    |

**Body (form-data):**

| KEY             | VALUE                      | TYPE   |
|-----------------|----------------------------|--------|
| `firstName`     | `Ahmed`                    | Text   |
| `lastName`      | `Khan`                     | Text   |
| `email`         | `admin@example.com`        | Text   |
| `password`      | `Admin@1234`               | Text   |
| `phoneNo`       | `9876543211`               | Text   |
| `gender`        | `Male`                     | Text   |
| `position`      | `Head Admin`               | Text   |
| `department`    | `IT`                       | Text   |
| `address`       | `Hyderabad, India`         | Text   |
| `profileImage`  | *(select a file)*          | **File** |

**Expected Response:**
```json
{
  "message": "Admin created successfully",
  "admin": { ... },
  "emailSent": true
}
```

> 💡 The new Admin will also receive their login credentials via email!

---

#### 2.2 Login Admin

| Setting       | Value                                          |
|---------------|-------------------------------------------------|
| **Method**    | `POST`                                         |
| **URL**       | `http://localhost:7092/admin/login`             |
| **Body Type** | `raw` → `JSON`                                 |

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "Admin@1234"
}
```

**Auto-save the token:** Add this in the **"Scripts" → "Post-response"** tab:
```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("adminToken", response.token);
    console.log("✅ Admin token saved!");
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

> ✅ The token is **automatically saved** to `{{adminToken}}`!

---

#### 2.3 Get Admin Profile

| Setting            | Value                                     |
|--------------------|-------------------------------------------|
| **Method**         | `GET`                                     |
| **URL**            | `http://localhost:7092/admin/profile`      |
| **Authorization**  | Bearer Token → **Admin's token**          |

---

#### 2.4 View All Admins

| Setting            | Value                                        |
|--------------------|----------------------------------------------|
| **Method**         | `GET`                                        |
| **URL**            | `http://localhost:7092/admin/viewAdmins`      |
| **Authorization**  | Bearer Token → **Admin's token**             |

---

#### 2.5 View Single Admin by ID

| Setting            | Value                                                       |
|--------------------|-------------------------------------------------------------|
| **Method**         | `GET`                                                       |
| **URL**            | `http://localhost:7092/admin/singleviewAdmin/<ADMIN_ID>`     |
| **Authorization**  | Bearer Token → **Admin's token**                            |

> Replace `<ADMIN_ID>` with the actual `_id` value from the create response (e.g., `6623a1b2c3d4e5f6a7b8c9d0`)

---

#### 2.6 Update Admin (Own Profile)

| Setting            | Value                                     |
|--------------------|-------------------------------------------|
| **Method**         | `PUT`                                     |
| **URL**            | `http://localhost:7092/admin/update`       |
| **Authorization**  | Bearer Token → **Admin's token**          |
| **Body Type**      | `form-data`                               |

**Body (form-data) — only include fields you want to update:**

| KEY             | VALUE                    | TYPE   |
|-----------------|--------------------------|--------|
| `phoneNo`       | `9999999999`             | Text   |
| `address`       | `Mumbai, India`          | Text   |
| `profileImage`  | *(select a new file)*    | **File** |

---

#### 2.7 Delete Admin (SuperAdmin deletes Admin)

| Setting            | Value                                                  |
|--------------------|--------------------------------------------------------|
| **Method**         | `DELETE`                                               |
| **URL**            | `http://localhost:7092/admin/delete/<ADMIN_ID>`         |
| **Authorization**  | Bearer Token → **SuperAdmin's token** ⚠️               |

> ⚠️ **Only the SuperAdmin can delete an Admin!** Use the SuperAdmin token here, not the Admin's.

---

### PHASE 3: Manager

> ⚠️ For creating a Manager, you need the **Admin token** from step 2.2.

#### 3.1 Create Manager (Admin creates Manager)

| Setting            | Value                                          |
|--------------------|-------------------------------------------------|
| **Method**         | `POST`                                         |
| **URL**            | `http://localhost:7092/manager/create`          |
| **Authorization**  | Bearer Token → **Admin's token**               |
| **Body Type**      | `form-data`                                    |

**Body (form-data):**

| KEY             | VALUE                         | TYPE   |
|-----------------|-------------------------------|--------|
| `firstName`     | `Ravi`                        | Text   |
| `lastName`      | `Kumar`                       | Text   |
| `email`         | `manager@example.com`         | Text   |
| `password`      | `Manager@1234`                | Text   |
| `phoneNo`       | `9876543212`                  | Text   |
| `gender`        | `Male`                        | Text   |
| `position`      | `Project Manager`             | Text   |
| `department`    | `Engineering`                 | Text   |
| `address`       | `Bangalore, India`            | Text   |
| `profileImage`  | *(select a file)*             | **File** |

---

#### 3.2 Login Manager

| Setting       | Value                                          |
|---------------|-------------------------------------------------|
| **Method**    | `POST`                                         |
| **URL**       | `http://localhost:7092/manager/login`           |
| **Body Type** | `raw` → `JSON`                                 |

**Body:**
```json
{
  "email": "manager@example.com",
  "password": "Manager@1234"
}
```

**Auto-save the token:** Add this in the **"Scripts" → "Post-response"** tab:
```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("managerToken", response.token);
    console.log("✅ Manager token saved!");
}
```

> ✅ The token is **automatically saved** to `{{managerToken}}`!

---

#### 3.3 Get Manager Profile

| Setting            | Value                                       |
|--------------------|---------------------------------------------|
| **Method**         | `GET`                                       |
| **URL**            | `http://localhost:7092/manager/profile`      |
| **Authorization**  | Bearer Token → **Manager's token**          |

---

#### 3.4 View All Managers (Admin only)

| Setting            | Value                                           |
|--------------------|-------------------------------------------------|
| **Method**         | `GET`                                           |
| **URL**            | `http://localhost:7092/manager/viewManagers`     |
| **Authorization**  | Bearer Token → **Admin's token** ⚠️             |

---

#### 3.5 View Single Manager by ID (Admin only)

| Setting            | Value                                                           |
|--------------------|-----------------------------------------------------------------|
| **Method**         | `GET`                                                           |
| **URL**            | `http://localhost:7092/manager/singleviewManager/<MANAGER_ID>`  |
| **Authorization**  | Bearer Token → **Admin's token** ⚠️                             |

---

#### 3.6 Update Manager (Own Profile)

| Setting            | Value                                       |
|--------------------|---------------------------------------------|
| **Method**         | `PUT`                                       |
| **URL**            | `http://localhost:7092/manager/update`       |
| **Authorization**  | Bearer Token → **Manager's token**          |
| **Body Type**      | `form-data`                                 |

---

#### 3.7 Delete Manager (Admin deletes Manager)

| Setting            | Value                                                     |
|--------------------|-----------------------------------------------------------|
| **Method**         | `DELETE`                                                  |
| **URL**            | `http://localhost:7092/manager/delete/<MANAGER_ID>`       |
| **Authorization**  | Bearer Token → **Admin's token** ⚠️                       |

---

### PHASE 4: Employee

> ⚠️ For creating an Employee, you need the **Manager token** from step 3.2.

#### 4.1 Create Employee (Manager creates Employee)

| Setting            | Value                                           |
|--------------------|-------------------------------------------------|
| **Method**         | `POST`                                          |
| **URL**            | `http://localhost:7092/employee/create`          |
| **Authorization**  | Bearer Token → **Manager's token**              |
| **Body Type**      | `form-data`                                     |

**Body (form-data):**

| KEY             | VALUE                         | TYPE   |
|-----------------|-------------------------------|--------|
| `firstName`     | `Priya`                       | Text   |
| `lastName`      | `Sharma`                      | Text   |
| `email`         | `employee@example.com`        | Text   |
| `password`      | `Employee@1234`               | Text   |
| `phoneNo`       | `9876543213`                  | Text   |
| `gender`        | `Female`                      | Text   |
| `position`      | `Software Developer`          | Text   |
| `department`    | `Engineering`                 | Text   |
| `address`       | `Chennai, India`              | Text   |
| `profileImage`  | *(select a file)*             | **File** |

---

#### 4.2 Login Employee

| Setting       | Value                                          |
|---------------|-------------------------------------------------|
| **Method**    | `POST`                                         |
| **URL**       | `http://localhost:7092/employee/login`          |
| **Body Type** | `raw` → `JSON`                                 |

**Body:**
```json
{
  "email": "employee@example.com",
  "password": "Employee@1234"
}
```

---

#### 4.3 Get Employee Profile

| Setting            | Value                                        |
|--------------------|----------------------------------------------|
| **Method**         | `GET`                                        |
| **URL**            | `http://localhost:7092/employee/profile`      |
| **Authorization**  | Bearer Token → **Employee's token**          |

---

#### 4.4 View All Employees (Manager only)

| Setting            | Value                                            |
|--------------------|--------------------------------------------------|
| **Method**         | `GET`                                            |
| **URL**            | `http://localhost:7092/employee/viewEmployees`   |
| **Authorization**  | Bearer Token → **Manager's token** ⚠️            |

---

#### 4.5 View Single Employee by ID (Manager only)

| Setting            | Value                                                              |
|--------------------|--------------------------------------------------------------------|
| **Method**         | `GET`                                                              |
| **URL**            | `http://localhost:7092/employee/singleviewEmployee/<EMPLOYEE_ID>`  |
| **Authorization**  | Bearer Token → **Manager's token** ⚠️                              |

---

#### 4.6 Update Employee (Own Profile)

| Setting            | Value                                        |
|--------------------|----------------------------------------------|
| **Method**         | `PUT`                                        |
| **URL**            | `http://localhost:7092/employee/update`       |
| **Authorization**  | Bearer Token → **Employee's token**          |
| **Body Type**      | `form-data`                                  |

---

#### 4.7 Delete Employee (Manager deletes Employee)

| Setting            | Value                                                      |
|--------------------|--------------------------------------------------------------|
| **Method**         | `DELETE`                                                     |
| **URL**            | `http://localhost:7092/employee/delete/<EMPLOYEE_ID>`        |
| **Authorization**  | Bearer Token → **Manager's token** ⚠️                        |

---

## 7. How to Use Authorization Tokens

Most endpoints are **protected** — they require a valid JWT token.

### 🚀 Method 1: Automatic Token Setup (Recommended — No Copy-Paste!)

JWT tokens are very long strings. Instead of copying and pasting them manually, set up Postman to **automatically capture and use tokens**.

#### Step 1: Create a Postman Environment

1. Click the **⚙️ gear icon** (top-right corner of Postman) or the **"Environments"** tab in the left sidebar
2. Click **"+"** or **"Create Environment"**
3. Name it: **`PR_9 Dev`**
4. Add these 4 variables (leave the values empty):

| VARIABLE              | INITIAL VALUE | CURRENT VALUE |
|-----------------------|---------------|---------------|
| `superAdminToken`     |               |               |
| `adminToken`          |               |               |
| `managerToken`        |               |               |
| `employeeToken`       |               |               |

5. Click **Save**
6. **Select this environment** from the dropdown in the top-right corner of Postman (it says "No Environment" by default)

#### Step 2: Add Auto-Save Script to Each Login Request

Go to each login request and add a **Post-response Script** that automatically saves the token:

1. Open the login request (e.g., **Login SuperAdmin**)
2. Click the **"Scripts"** tab → **"Post-response"** (in older Postman versions, it's the **"Tests"** tab)
3. Paste the matching script below:

**For SuperAdmin Login:**
```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("superAdminToken", response.token);
    console.log("✅ SuperAdmin token saved!");
}
```

**For Admin Login:**
```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("adminToken", response.token);
    console.log("✅ Admin token saved!");
}
```

**For Manager Login:**
```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("managerToken", response.token);
    console.log("✅ Manager token saved!");
}
```

**For Employee Login:**
```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("employeeToken", response.token);
    console.log("✅ Employee token saved!");
}
```

4. Click **Save** (Ctrl + S)

#### Step 3: Use Variables in Protected Requests

For any protected request:

1. Click the **"Authorization"** tab
2. Select **"Bearer Token"**
3. In the **Token** field, type the variable name instead of pasting a token:

| If the endpoint needs...   | Type this in the Token field |
|----------------------------|------------------------------|
| SuperAdmin token           | `{{superAdminToken}}`        |
| Admin token                | `{{adminToken}}`             |
| Manager token              | `{{managerToken}}`           |
| Employee token             | `{{employeeToken}}`          |

```
┌──────────────────────────────────────────────────────┐
│  Authorization Tab                                    │
│                                                       │
│  Auth Type:  [Bearer Token  ▼]                        │
│                                                       │
│  Token:      [{{superAdminToken}}]     ← variable!   │
│                                                       │
└──────────────────────────────────────────────────────┘
```

> 🎉 **That's it!** Now every time you login, the token is saved automatically. All protected requests will use the latest token — **zero copy-paste!**

---

### 📋 Method 2: Manual Copy-Paste (Simple but Tedious)

1. First, **login** to get a token (SuperAdmin/Admin/Manager/Employee login)
2. Copy the `token` value from the response
3. Open the request that needs authorization
4. Click the **"Authorization"** tab (between Params and Headers)
5. From the **"Auth Type"** dropdown, select **"Bearer Token"**
6. Paste the token in the **"Token"** input field
7. Click **Send**

> ⚠️ This method requires you to re-copy the token every time you login. **Method 1 is strongly recommended.**

---

### Which token for which endpoint?

| Endpoint                        | Token Required       |
|---------------------------------|----------------------|
| `POST /superadmin/register`     | ❌ None              |
| `POST /superadmin/login`        | ❌ None              |
| `GET  /superadmin/profile`      | 🔑 SuperAdmin token  |
| `POST /admin/login`             | ❌ None              |
| `POST /admin/create`            | 🔑 SuperAdmin token  |
| `GET  /admin/profile`           | 🔑 Admin token       |
| `GET  /admin/viewAdmins`        | 🔑 Admin token       |
| `GET  /admin/singleviewAdmin/:id` | 🔑 Admin token     |
| `PUT  /admin/update`            | 🔑 Admin token       |
| `DELETE /admin/delete/:id`      | 🔑 SuperAdmin token  |
| `POST /manager/login`           | ❌ None              |
| `POST /manager/create`          | 🔑 Admin token       |
| `GET  /manager/profile`         | 🔑 Manager token     |
| `GET  /manager/viewManagers`    | 🔑 Admin token       |
| `GET  /manager/singleviewManager/:id` | 🔑 Admin token |
| `PUT  /manager/update`          | 🔑 Manager token     |
| `DELETE /manager/delete/:id`    | 🔑 Admin token       |
| `POST /employee/login`          | ❌ None              |
| `POST /employee/create`         | 🔑 Manager token     |
| `GET  /employee/profile`        | 🔑 Employee token    |
| `GET  /employee/viewEmployees`  | 🔑 Manager token     |
| `GET  /employee/singleviewEmployee/:id` | 🔑 Manager token |
| `PUT  /employee/update`         | 🔑 Employee token    |
| `DELETE /employee/delete/:id`   | 🔑 Manager token     |

---

## 8. How to Upload Files (Profile Image)

Some endpoints accept a **profile image** upload. Here's how:

### When to use `form-data` vs `raw JSON`:

| Body Type       | When to Use                                        |
|-----------------|----------------------------------------------------|
| **form-data**   | When uploading a file (register, create, update)   |
| **raw → JSON**  | When sending only text data (login)                |

### Steps to upload an image:

1. In the **Body** tab, select **"form-data"**
2. Type `profileImage` in the KEY column
3. **Hover** over the KEY field — you'll see a small dropdown that says "Text"
4. **Change it to "File"** by clicking the dropdown
5. A **"Select Files"** button appears in the VALUE column
6. Click it and browse to select an image (`.jpg`, `.png`, etc.)
7. Fill in the other fields as Text
8. Click **Send**

```
┌─────────────────────────────────────────────────────────────┐
│  Body  →  form-data                                          │
│                                                              │
│  KEY              │  VALUE                        │ TYPE     │
│  ─────────────────┼───────────────────────────────┼────────  │
│  firstName        │  Zaheer                       │ Text     │
│  lastName         │  Shaik                        │ Text     │
│  email            │  test@example.com             │ Text     │
│  password         │  Test@1234                    │ Text     │
│  profileImage     │  [Select Files]  photo.jpg    │ File ◄── │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

> 💡 `profileImage` is **optional**. If you don't want to upload one, just skip that row.

---

## 9. Common Errors & Troubleshooting

### ❌ "Could not send request" / Connection refused

```
Error: connect ECONNREFUSED 127.0.0.1:7092
```

**Fix:** Your server is not running. Open your terminal and run:
```bash
npm run dev
```

---

### ❌ "SuperAdmin not found" / "Admin not found"

**Fix:** You haven't registered/created this user yet. Follow the guide in order.

---

### ❌ "Invalid password"

**Fix:** Make sure you're typing the exact password you used during registration/creation.

---

### ❌ Empty response or `{}` with no data

**Fix:** Check if:
- You selected the correct HTTP method (GET/POST/PUT/DELETE)
- You're sending the body in the correct format (form-data vs raw JSON)
- For raw JSON, the dropdown says "JSON" not "Text"

---

### ❌ No Authorization header / Token error

**Fix:**
1. Make sure you selected **"Bearer Token"** in the Authorization tab
2. Make sure the token is pasted correctly (no extra spaces or quotes)
3. Tokens expire after **1 day** — login again to get a fresh one

---

### ❌ "Cannot POST /superAdmin/register" (404)

**Fix:** URLs are **case-sensitive**! Use lowercase:
- ✅ `/superadmin/register`
- ❌ `/superAdmin/register`

---

### ❌ "SuperAdmin already exists"

**Fix:** You've already registered a SuperAdmin with that email. Use a different email or proceed to login.

---

## 10. Tips & Best Practices

### 💡 Save your requests
- After testing a request, press **Ctrl + S** to save it in your collection
- Name each request clearly (e.g., "Login SuperAdmin", "Create Admin")

### 💡 Use Postman Variables (Advanced)
- Save your base URL as a variable: `{{baseUrl}}` = `http://localhost:7092`
- Then use `{{baseUrl}}/superadmin/login` in your requests
- Go to **Collection → Variables** tab to set this up

### 💡 Use Environments for Tokens (Advanced)
- Create an environment called "PR_9 Dev"
- Add variables like `superAdminToken`, `adminToken`, `managerToken`, `employeeToken`
- In Authorization, use `{{superAdminToken}}` instead of pasting manually

### 💡 Check response time
- The response time is shown in the top right after each request
- This helps you identify slow endpoints

### 💡 Pretty vs Raw view
- After getting a response, use the **"Pretty"** tab (default) for formatted JSON
- Use **"Raw"** to see the unformatted response

### 💡 Testing order checklist

```
□ 1. Register SuperAdmin         (POST /superadmin/register)
□ 2. Login SuperAdmin            (POST /superadmin/login)        → Save token
□ 3. Get SuperAdmin Profile      (GET  /superadmin/profile)
□ 4. Create Admin                (POST /admin/create)            → Uses SuperAdmin token
□ 5. Login Admin                 (POST /admin/login)             → Save token
□ 6. Get Admin Profile           (GET  /admin/profile)
□ 7. View All Admins             (GET  /admin/viewAdmins)
□ 8. Create Manager              (POST /manager/create)          → Uses Admin token
□ 9. Login Manager               (POST /manager/login)           → Save token
□ 10. Get Manager Profile        (GET  /manager/profile)
□ 11. View All Managers           (GET  /manager/viewManagers)    → Uses Admin token
□ 12. Create Employee             (POST /employee/create)         → Uses Manager token
□ 13. Login Employee              (POST /employee/login)          → Save token
□ 14. Get Employee Profile        (GET  /employee/profile)
□ 15. View All Employees          (GET  /employee/viewEmployees)  → Uses Manager token
□ 16. Update Employee             (PUT  /employee/update)
□ 17. Update Manager              (PUT  /manager/update)
□ 18. Update Admin                (PUT  /admin/update)
□ 19. Delete Employee             (DELETE /employee/delete/:id)   → Uses Manager token
□ 20. Delete Manager              (DELETE /manager/delete/:id)    → Uses Admin token
□ 21. Delete Admin                (DELETE /admin/delete/:id)      → Uses SuperAdmin token
```

---

## 🎉 You're Done!

You've successfully tested all the endpoints of the PR_9 REST API. You now know how to:

- ✅ Send GET, POST, PUT, and DELETE requests
- ✅ Use JSON body and form-data
- ✅ Upload files in Postman
- ✅ Authenticate using Bearer Tokens
- ✅ Navigate a role-based access control system

> **Next Steps:** Try breaking things! Send requests with wrong tokens, missing fields, or invalid IDs — see how the API responds. This is the best way to learn!

---

*Guide created for PR_9 REST API — Role-Based Access Control System*
