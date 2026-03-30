const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// create admin (superadmin creates admin)
const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNo, gender, position, address, department } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
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

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// get admin profile (own profile)
const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// view all admins
const viewAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// single view admin by id
const singleviewAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// update admin (own profile)
const updateAdmin = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.profileImage = req.file.path;
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const admin = await Admin.findByIdAndUpdate(req.user.id, updatedData, { new: true }).select("-password");
    res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// delete admin (only superadmin can delete)
const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { createAdmin, loginAdmin, getAdmin, viewAdmins, singleviewAdmin, updateAdmin, deleteAdmin };
