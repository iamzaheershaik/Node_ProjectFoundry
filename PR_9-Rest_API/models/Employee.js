const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    position: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "employee",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
