# ExtraCategory — Detailed Cascading Logic & Code Explanation

## 📌 Overview: The 3-Level Hierarchy

```
Category (Level 1 — Parent)
  └── Subcategory (Level 2 — Child of Category)
        └── ExtraCategory (Level 3 — Child of Subcategory)
```

Each level references the one above it using **MongoDB ObjectId references**. This creates a **cascading chain** where:

- Deleting a **Category** → deletes all its Subcategories → deletes all their ExtraCategories
- Deleting a **Subcategory** → deletes all its ExtraCategories
- The **Add ExtraCategory** form uses **cascading dropdowns** (Category → Subcategory via AJAX)

---

## 📁 File Structure

```
PR_8-Categories/
├── model/
│   ├── category.model.js          ← Level 1 (no parent ref)
│   ├── subcategory.model.js       ← Level 2 (refs Category)
│   └── extracategory.model.js     ← Level 3 (refs Subcategory) [NEW]
├── controller/
│   ├── category.controller.js     ← CRUD + cascade delete Sub + Extra
│   ├── subcategory.controller.js  ← CRUD + cascade delete Extra
│   └── extracategory.controller.js ← CRUD + API endpoint [NEW]
├── routes/
│   ├── category.routes.js
│   ├── subcategory.routes.js      ← Has API: /api/by-category/:id
│   ├── extracategory.routes.js    ← Has API: /api/by-subcategory/:id [NEW]
│   └── index.routes.js            ← Mounts all route files
├── views/
│   ├── header.ejs                 ← Sidebar (has ExtraCategory links)
│   ├── category/
│   │   ├── viewCategory.ejs       ← Table view
│   │   ├── addCategory.ejs
│   │   ├── editCategory.ejs
│   │   └── singleView.ejs         ← Shows related Subcategories
│   ├── subcategory/
│   │   ├── viewSubcategory.ejs    ← Table view + ExtraCategory count
│   │   ├── addSubcategory.ejs     ← Dropdown: select Category
│   │   ├── editSubcategory.ejs
│   │   └── singleView.ejs         ← Shows related ExtraCategories
│   └── extracategory/             ← [NEW FOLDER]
│       ├── viewExtracategory.ejs  ← CARD-BASED view (not table!)
│       ├── addExtracategory.ejs   ← Cascading dropdown: Cat → SubCat
│       ├── editExtracategory.ejs  ← Pre-populated cascading dropdown
│       └── singleView.ejs         ← Shows parent chain
```

---

## 🔗 How the Cascading Connection Works

### 1. MODEL LAYER — Schema References (ObjectId)

#### `category.model.js` — Level 1 (No parent reference)

```js
const categorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  categoryImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});
```

- **No `ref` field** — Category is the top-level parent.
- `name` is `unique: true` to prevent duplicate categories.

#### `subcategory.model.js` — Level 2 (References Category)

```js
const subcategorySchema = mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId, // ← stores the _id of a Category document
    ref: "Category", // ← tells Mongoose which model to populate from
    required: true, // ← every Subcategory MUST belong to a Category
  },
  description: { type: String },
  subcategoryImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});
```

- **`category` field** uses `mongoose.Schema.Types.ObjectId` — this stores the MongoDB `_id` of the parent Category document.
- **`ref: "Category"`** — this tells Mongoose "when I call `.populate('category')`, go look in the `Category` collection and replace this ObjectId with the full Category document."
- **`required: true`** — enforces that every Subcategory must have a parent Category.

#### `extracategory.model.js` — Level 3 (References Subcategory)

```js
const extracategorySchema = mongoose.Schema({
  name: { type: String, required: true },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId, // ← stores the _id of a Subcategory document
    ref: "Subcategory", // ← tells Mongoose which model to populate from
    required: true, // ← every ExtraCategory MUST belong to a Subcategory
  },
  description: { type: String },
  extracategoryImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});
```

- **Same pattern** as Subcategory, but `ref: "Subcategory"` instead of `ref: "Category"`.
- The chain is: ExtraCategory → Subcategory → Category.

---

### 2. CONTROLLER LAYER — CRUD Operations & Cascading

#### How `.populate()` Works (Reading Data)

**Simple populate (Subcategory → Category):**

```js
let subcategory = await Subcategory.findById(id).populate("category");
// Result: subcategory.category = { _id: "...", name: "Tech", ... }
// Without populate: subcategory.category = "64f7a1b2c3d4e5f6a7b8c9d0" (just the ID)
```

**Nested populate (ExtraCategory → Subcategory → Category):**

```js
let extracategory = await Extracategory.findById(id).populate({
  path: "subcategory", // First: populate the subcategory field
  populate: { path: "category" }, // Then: inside that subcategory, populate its category field
});
// Result: extracategory.subcategory.category.name = "Tech"
//         extracategory.subcategory.name = "Web Dev"
//         extracategory.name = "React Hooks"
```

#### How Cascade Delete Works

**When deleting a CATEGORY (Level 1):**

```js
// category.controller.js → deleteCategory

// Step 1: Find the category
let category = await Category.findById(req.params.id);

// Step 2: Delete category's own image file from disk
if (category.categoryImage) {
  let filePath = path.join(__dirname, "..", category.categoryImage);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

// Step 3: Find ALL subcategories belonging to this category
let subcategories = await Subcategory.find({ category: req.params.id });

// Step 4: For EACH subcategory...
for (let sub of subcategories) {
  // 4a: Delete subcategory's image
  if (sub.subcategoryImage) {
    let subPath = path.join(__dirname, "..", sub.subcategoryImage);
    if (fs.existsSync(subPath)) fs.unlinkSync(subPath);
  }

  // 4b: Find ALL extracategories under THIS subcategory
  let extracategories = await Extracategory.find({ subcategory: sub._id });
  for (let extra of extracategories) {
    // 4c: Delete each extracategory's image
    if (extra.extracategoryImage) {
      let extraPath = path.join(__dirname, "..", extra.extracategoryImage);
      if (fs.existsSync(extraPath)) fs.unlinkSync(extraPath);
    }
  }
  // 4d: Delete ALL extracategories of this subcategory from DB
  await Extracategory.deleteMany({ subcategory: sub._id });
}

// Step 5: Delete ALL subcategories of this category from DB
await Subcategory.deleteMany({ category: req.params.id });

// Step 6: Finally, delete the category itself from DB
await Category.findByIdAndDelete(req.params.id);
```

**When deleting a SUBCATEGORY (Level 2):**

```js
// subcategory.controller.js → deleteSubcategory

// Step 1: Delete subcategory image
// Step 2: Find ALL extracategories under this subcategory
let extracategories = await Extracategory.find({ subcategory: req.params.id });
// Step 3: Delete each extracategory's image file
for (let extra of extracategories) { ... }
// Step 4: Delete ALL extracategories from DB
await Extracategory.deleteMany({ subcategory: req.params.id });
// Step 5: Delete the subcategory itself
await Subcategory.findByIdAndDelete(req.params.id);
```

**When deleting an EXTRACATEGORY (Level 3):**

```js
// extracategory.controller.js → deleteExtracategory

// Simple: just delete image + document (no children to cascade)
let extracategory = await Extracategory.findById(req.params.id);
if (extracategory.extracategoryImage) { ... fs.unlinkSync(...) }
await Extracategory.findByIdAndDelete(req.params.id);
```

---

### 3. ROUTES LAYER — URL Mapping & API Endpoints

#### `extracategory.routes.js` — All Routes

```js
// CRUD Routes (all protected by passport authentication)
router.get("/view", ...)           // GET /extracategory/view → viewAllExtracategories
router.get("/add", ...)            // GET /extracategory/add → addExtracategoryPage
router.post("/add", ...)           // POST /extracategory/add → addExtracategory (with multer)
router.get("/view/:id", ...)       // GET /extracategory/view/123 → viewSingleExtracategory
router.get("/edit/:id", ...)       // GET /extracategory/edit/123 → editExtracategoryPage
router.post("/edit/:id", ...)      // POST /extracategory/edit/123 → editExtracategory (with multer)
router.get("/delete/:id", ...)     // GET /extracategory/delete/123 → deleteExtracategory

// API endpoint for cascading dropdown
router.get("/api/by-subcategory/:subcategoryId", ...) // Returns JSON array of extracategories
```

#### `index.routes.js` — Route Mounting

```js
router.use("/category", categoryRoutes); // /category/view, /category/add, etc.
router.use("/subcategory", subcategoryRoutes); // /subcategory/view, /subcategory/add, etc.
router.use("/extracategory", extracategoryRoutes); // /extracategory/view, /extracategory/add, etc.
```

#### API Endpoints for Cascading Dropdowns

| API Route                                              | Purpose                               | Returns                       |
| ------------------------------------------------------ | ------------------------------------- | ----------------------------- |
| `GET /subcategory/api/by-category/:categoryId`         | Get subcategories for a Category      | JSON array of Subcategories   |
| `GET /extracategory/api/by-subcategory/:subcategoryId` | Get extracategories for a Subcategory | JSON array of ExtraCategories |

---

### 4. VIEW LAYER — EJS Templates & Cascading Dropdowns

#### Card-Based View (ExtraCategory — Different from Table!)

The **ViewExtracategory** page uses **Bootstrap cards** instead of a table:

```html
<!-- Each extracategory is a card in a responsive grid -->
<div class="col-lg-4 col-md-6 col-sm-12 mb-4">
  <div class="card h-100">
    <!-- Card Image (180px height) -->
    <div style="height: 180px; overflow: hidden;">
      <img
        src="<%= extra.extracategoryImage %>"
        style="width: 100%; height: 100%; object-fit: cover;"
      />
    </div>
    <!-- Card Body (name, parent badges, description) -->
    <div class="card-body">
      <h5><%= extra.name %></h5>
      <span class="badge badge-info"
        ><%= extra.subcategory.category.name %></span
      >
      <!-- Grandparent -->
      <span class="badge badge-primary"><%= extra.subcategory.name %></span>
      <!-- Parent -->
      <p><%= extra.description %></p>
    </div>
    <!-- Card Footer (View/Edit/Delete buttons) -->
    <div class="card-footer">...</div>
  </div>
</div>
```

#### Cascading Dropdown (JavaScript/AJAX)

In `addExtracategory.ejs`, when user selects a Category, an AJAX call fetches the matching Subcategories:

```html
<!-- Step 1: Category dropdown (no name attribute — not submitted to server) -->
<select id="parentCategory">
  <% categories.forEach(function(cat) { %>
  <option value="<%= cat._id %>"><%= cat.name %></option>
  <% }) %>
</select>

<!-- Step 2: Subcategory dropdown (has name="subcategory" — THIS gets submitted) -->
<select id="parentSubcategory" name="subcategory">
  <!-- Options loaded dynamically via AJAX -->
</select>
```

```js
// Step 3: jQuery AJAX — fires when Category dropdown changes
$("#parentCategory").on("change", function () {
  var categoryId = $(this).val(); // Get selected category ObjectId
  var subcategorySelect = $("#parentSubcategory");

  // Call the API endpoint we created in subcategory.routes.js
  $.ajax({
    url: "/subcategory/api/by-category/" + categoryId, // ← API endpoint
    method: "GET",
    success: function (data) {
      // data = JSON array of subcategories matching this category
      subcategorySelect.html(
        "<option disabled selected>Select Parent Subcategory</option>",
      );
      data.forEach(function (sub) {
        // Dynamically create <option> for each subcategory
        subcategorySelect.append(
          '<option value="' + sub._id + '">' + sub.name + "</option>",
        );
      });
    },
  });
});
```

**Flow:**

1. Page loads → Category dropdown is pre-filled from server
2. User selects "Technology" → jQuery `change` event fires
3. AJAX `GET /subcategory/api/by-category/64f...` → server queries `Subcategory.find({ category: "64f..." })`
4. Server returns JSON `[{_id: "...", name: "Web Dev"}, {_id: "...", name: "Mobile Dev"}]`
5. jQuery populates the Subcategory dropdown with these options
6. User selects "Web Dev" and fills other fields → form submits `subcategory=64f...` (the ObjectId)

---

### 5. SIDEBAR NAVIGATION

In `header.ejs`, each management section follows the same pattern:

```html
<li class="sidebar-item">
  <a class="sidebar-link has-arrow">
    <!-- has-arrow = collapsible -->
    <i class="mdi mdi-folder-multiple-outline"></i>
    <span class="hide-menu">ExtraCategory Mgmt</span>
  </a>
  <ul class="collapse first-level">
    <!-- Collapsed submenu -->
    <li><a href="/extracategory/view">View ExtraCategories</a></li>
    <li><a href="/extracategory/add">Add ExtraCategory</a></li>
  </ul>
</li>
```

---

## 🔄 Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE (MongoDB)                          │
│                                                                     │
│  categories collection    subcategories collection    extracategories│
│  ┌──────────────┐        ┌──────────────────┐        ┌──────────── │
│  │ _id: ObjectId │◄──────│ category: ObjectId│◄──────│ subcategory: │
│  │ name: "Tech"  │  ref  │ name: "Web Dev"   │  ref  │   ObjectId  │
│  │ description   │       │ description        │       │ name: "React│
│  │ categoryImage │       │ subcategoryImage   │       │ extracatImg │
│  └──────────────┘        └──────────────────┘        └──────────── │
│                                                                     │
│  Level 1                  Level 2                     Level 3       │
└─────────────────────────────────────────────────────────────────────┘

CASCADE DELETE FLOW:
  Delete Category ──→ Delete ALL Subcategories ──→ Delete ALL ExtraCategories
                      (+ their images)              (+ their images)

POPULATE FLOW (Reading):
  ExtraCategory.findById(id).populate({
      path: "subcategory",
      populate: { path: "category" }
  })
  Result: extra.subcategory.category.name = "Tech"
          extra.subcategory.name = "Web Dev"
          extra.name = "React Hooks"

CASCADING DROPDOWN FLOW (Add Form):
  User selects Category ──AJAX──→ GET /subcategory/api/by-category/:id
                                        │
                                        ▼
                                  Returns JSON subcategories
                                        │
                                        ▼
                              Populates Subcategory dropdown
                                        │
                                        ▼
                              User selects Subcategory
                                        │
                                        ▼
                              Form submits subcategory ObjectId
```

---

## 🧪 Testing Checklist

1. ✅ Create a Category → verify it appears in the view
2. ✅ Create a Subcategory under that Category → verify parent shown
3. ✅ Create an ExtraCategory → verify cascading dropdown works
4. ✅ View ExtraCategories → verify **card layout** (not table)
5. ✅ View single ExtraCategory → verify parent chain badges
6. ✅ Edit ExtraCategory → verify pre-populated dropdowns
7. ✅ Delete ExtraCategory → verify only it is removed
8. ✅ Delete Subcategory → verify its ExtraCategories also deleted
9. ✅ Delete Category → verify Subcategories AND ExtraCategories all deleted
