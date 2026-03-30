const Manager = require("../models/Manager");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// create manager (admin creates manager)
const createManager = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNo, gender, position, address, department } = req.body;

    // check if manager already exists
    const managerExists = await Manager.findOne({ email });
    if (managerExists) {
      return res.status(400).json({ message: "Manager already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create manager
    const manager = await Manager.create({
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

    res.status(201).json({ message: "Manager created successfully", manager });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// login manager
const loginManager = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find manager
    const manager = await Manager.findOne({ email });
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // create token
    const token = jwt.sign(
      { id: manager._id, role: manager.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// view all managers (admin can see all)
const viewManagers = async (req, res) => {
  try {
    const managers = await Manager.find().select("-password");
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// single view manager by id
const singleviewManager = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id).select("-password");
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json(manager);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// get single manager profile
const getManager = async (req, res) => {
  try {
    const manager = await Manager.findById(req.user.id).select("-password");
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json(manager);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// update manager
const updateManager = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.profileImage = req.file.path;
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const manager = await Manager.findByIdAndUpdate(req.user.id, updatedData, { new: true }).select("-password");
    res.status(200).json({ message: "Manager updated successfully", manager });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// delete manager (admin deletes)
const deleteManager = async (req, res) => {
  try {
    await Manager.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Manager deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { createManager, loginManager, viewManagers, singleviewManager, getManager, updateManager, deleteManager };
