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

    const adminObj = admin.toObject();
    if (adminObj.profileImage) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      adminObj.profileImage = `${baseUrl}/${adminObj.profileImage.replace(/\\/g, "/")}`;
    }

    res.json(adminObj);
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
      updatedData.profileImage = req.file.path.replace(/\\/g, "/");
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

// get admin profile as HTML page (renders image visually)
const getMyProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.json({ message: "Admin not found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = admin.profileImage
      ? `${baseUrl}/${admin.profileImage.replace(/\\/g, "/")}`
      : null;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${admin.firstName} ${admin.lastName} - Profile</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1a1a2e; color: #eee; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #16213e; border-radius: 16px; padding: 40px; max-width: 450px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.4); text-align: center; }
        .avatar { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid #0f3460; margin-bottom: 20px; }
        .no-avatar { width: 150px; height: 150px; border-radius: 50%; background: #0f3460; display: flex; align-items: center; justify-content: center; font-size: 48px; color: #e94560; margin: 0 auto 20px; }
        h1 { font-size: 24px; color: #e94560; margin-bottom: 4px; }
        .role { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #a8a8b3; margin-bottom: 24px; }
        .info { text-align: left; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #0f3460; }
        .info-row:last-child { border-bottom: none; }
        .label { color: #a8a8b3; font-size: 13px; }
        .value { color: #eee; font-size: 14px; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="card">
        ${imageUrl
          ? `<img class="avatar" src="${imageUrl}" alt="Profile Image" />`
          : `<div class="no-avatar">${admin.firstName[0]}${admin.lastName[0]}</div>`
        }
        <h1>${admin.firstName} ${admin.lastName}</h1>
        <div class="role">${admin.role}</div>
        <div class="info">
          <div class="info-row"><span class="label">Email</span><span class="value">${admin.email}</span></div>
          <div class="info-row"><span class="label">Phone</span><span class="value">${admin.phoneNo || "N/A"}</span></div>
          <div class="info-row"><span class="label">Gender</span><span class="value">${admin.gender || "N/A"}</span></div>
          <div class="info-row"><span class="label">Position</span><span class="value">${admin.position || "N/A"}</span></div>
          <div class="info-row"><span class="label">Department</span><span class="value">${admin.department || "N/A"}</span></div>
          <div class="info-row"><span class="label">Address</span><span class="value">${admin.address || "N/A"}</span></div>
        </div>
      </div>
    </body>
    </html>`;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    res.json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { createAdmin, loginAdmin, getAdmin, getMyProfile, viewAdmins, singleviewAdmin, updateAdmin, deleteAdmin };
