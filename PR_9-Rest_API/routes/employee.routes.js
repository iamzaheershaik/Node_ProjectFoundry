const express = require("express");
const router = express.Router();
const { createEmployee, loginEmployee, viewEmployees, singleviewEmployee, getEmployee, updateEmployee, deleteEmployee } = require("../controllers/employee.controller");
const managerAuth = require("../middleware/managerAuth");
const employeeAuth = require("../middleware/employeeAuth");
const upload = require("../config/multerConfig");

// public routes
router.post("/login", loginEmployee);

// manager protected routes (manager creates/deletes employee)
router.post("/create", managerAuth, upload.single("profileImage"), createEmployee);
router.get("/viewEmployees", managerAuth, viewEmployees);
router.get("/singleviewEmployee/:id", managerAuth, singleviewEmployee);
router.delete("/delete/:id", managerAuth, deleteEmployee);

// employee protected routes
router.get("/profile", employeeAuth, getEmployee);
router.put("/update", employeeAuth, upload.single("profileImage"), updateEmployee);

module.exports = router;
