const SuperAdmin = require("../models/SuperAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register superadmin
const registerSuperAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNo, gender } = req.body;

    const superAdminExists = await SuperAdmin.findOne({ email });
    if (superAdminExists) {
      return res.json({ message: "SuperAdmin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await SuperAdmin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNo,
      gender,
    });

    res.json({ message: "SuperAdmin registered successfully", superAdmin });
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

// login superadmin
const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.json({ message: "SuperAdmin not found" });
    }

    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

// get superadmin profile
const getSuperAdmin = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.user.id).select("-password");
    if (!superAdmin) {
      return res.json({ message: "SuperAdmin not found" });
    }
    res.json(superAdmin);
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

// update superadmin profile
const updateSuperAdmin = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.profileImage = req.file.path;
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const superAdmin = await SuperAdmin.findByIdAndUpdate(req.user.id, updatedData, { new: true }).select("-password");
    if (!superAdmin) {
      return res.json({ message: "SuperAdmin not found" });
    }
    res.json({ message: "SuperAdmin updated successfully", superAdmin });
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { registerSuperAdmin, loginSuperAdmin, getSuperAdmin, updateSuperAdmin };
