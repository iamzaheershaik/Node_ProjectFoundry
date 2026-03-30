const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendCredentialsMail = require("../utils/sendCredentialsMail");

// create admin (superadmin creates admin)
const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNo, gender, position, address, department } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNo,
      gender,
      position,
      address,
      department,
      createdBy: req.user.id,
    });

    // Send login credentials email to the new admin
    const emailResult = await sendCredentialsMail(
      email,
      `${firstName} ${lastName}`,
      password,
      "admin",
      "superadmin"
    );

    res.json({
      message: "Admin created successfully",
      admin,
      emailSent: emailResult.success,
    });
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

// login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

// get admin profile (own profile)
const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

// view all admins
const viewAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

// single view admin by id
const singleviewAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      return res.json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
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
    res.json({ message: "Admin updated successfully", admin });
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

// delete admin (only superadmin can delete)
const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { createAdmin, loginAdmin, getAdmin, viewAdmins, singleviewAdmin, updateAdmin, deleteAdmin };
