const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// create employee (manager creates employee)
const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNo, gender, position, address, department } = req.body;

    // check if employee already exists
    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create employee
    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImage: req.file ? req.file.path : "",
      phoneNo,
      gender,
      position,
      address,
      department,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// login employee
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find employee
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // create token
    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// view all employees (manager can see all)
const viewEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// single view employee by id
const singleviewEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select("-password");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// get single employee profile
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select("-password");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// update employee
const updateEmployee = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.profileImage = req.file.path;
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const employee = await Employee.findByIdAndUpdate(req.user.id, updatedData, { new: true }).select("-password");
    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// delete employee (manager deletes)
const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { createEmployee, loginEmployee, viewEmployees, singleviewEmployee, getEmployee, updateEmployee, deleteEmployee };
