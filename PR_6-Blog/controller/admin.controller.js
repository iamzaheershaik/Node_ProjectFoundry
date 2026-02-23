const Admin = require("../model/admin.model");
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

exports.viewAllAdmins = async (req, res) => {
    try {
        if (req.cookies && req.cookies.admin && req.cookies.admin._id != undefined)
        {
            let admins = await Admin.find();
            let user = req.cookies.admin;
            return res.render("admin/viewAdmin", { admins, user });
        } else {
            return res.redirect("/");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.addAdminPage = async (req, res) => {
    try {
        if (req.cookies && req.cookies.admin && req.cookies.admin._id != undefined){
            let user = req.cookies.admin;
            return res.render("admin/addAdmin", {user});
        }
        else
            return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.addAdmin = async (req, res) => {
    try {
        let imagePath = req.file ? `/uploads/${req.file.filename}` : "";
        let hashPassword = await bcrypt.hash(req.body.password, 10);
        let admin = await Admin.create({
            ...req.body,
            password: hashPassword,
            profileImage: imagePath
        });
        console.log('Admin Added Success');
        return res.redirect("/admin/add-admin");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.viewSingleAdmin = async (req, res) => {
    try {
        if (req.cookies && req.cookies.admin && req.cookies.admin._id != undefined){
            let admin = await Admin.findById(req.params.id);
            let user = req.cookies.admin;
            return res.render("admin/singleView", { admin, user });
        }
        else
            return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.editAdminPage = async (req, res) => {
    try {
        if (req.cookies && req.cookies.admin && req.cookies.admin._id != undefined){
            let admin = await Admin.findById(req.params.id);
            let user = req.cookies.admin;
            return res.render("admin/editAdmin", { admin, user });
        }
        else
            return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.editAdmin = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Only hash password if a new one is provided
        if (req.body.password && req.body.password.trim() !== "") {
            updateData.password = await bcrypt.hash(req.body.password, 10);
        } else {
            delete updateData.password;
        }

        // Only update image if a new one is uploaded
        if (req.file) {
            // Delete old profile image
            let oldAdmin = await Admin.findById(req.params.id);
            if (oldAdmin.profileImage) {
                let oldPath = path.join(__dirname, '..', oldAdmin.profileImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updateData.profileImage = `/uploads/${req.file.filename}`;
        }

        await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });
        console.log('Admin Updated Success');
        return res.redirect("/admin/view-admin");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.deleteAdmin = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);

        // Delete profile image
        if (admin.profileImage) {
            let filePath = path.join(__dirname, '..', admin.profileImage);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Admin.findByIdAndDelete(req.params.id);
        console.log('Admin Deleted Success');
        return res.redirect("/admin/view-admin");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}
