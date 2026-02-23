const Admin = require('../model/admin.model');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const sendMail = require('../middleware/nodemailer');

// In-memory OTP store { email: { otp, expiresAt } }
const otpStore = {};

exports.forgotPasswordPage = async (req, res) => {
    try {
        return res.render('auth/forgotPassword', { layout: false });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        let admin = await Admin.findOne({ email });
        if (!admin) {
            console.log('Email not found');
            return res.redirect('/forgot-password');
        }

        // Generate 6-digit OTP
        let otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5-minute expiry
        otpStore[email] = {
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000
        };

        // Send OTP via email
        let html = `
            <h2>Password Reset OTP</h2>
            <p>Your OTP for password reset is:</p>
            <h1 style="color: #7460ee; letter-spacing: 5px;">${otp}</h1>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;
        await sendMail(email, 'Password Reset OTP - Blog Admin Panel', html);

        console.log('OTP sent to:', email);
        return res.render('auth/verifyOtp', { layout: false, email });
    } catch (error) {
        console.log(error);
        return res.redirect('/forgot-password');
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        let storedOtp = otpStore[email];

        if (!storedOtp) {
            console.log('OTP not found or expired');
            return res.redirect('/forgot-password');
        }

        if (Date.now() > storedOtp.expiresAt) {
            delete otpStore[email];
            console.log('OTP expired');
            return res.redirect('/forgot-password');
        }

        if (storedOtp.otp !== otp) {
            console.log('Invalid OTP');
            return res.render('auth/verifyOtp', { layout: false, email });
        }

        // OTP verified, clear it and go to reset password page
        delete otpStore[email];
        console.log('OTP verified for:', email);
        return res.render('auth/resetPassword', { layout: false, email });
    } catch (error) {
        console.log(error);
        return res.redirect('/forgot-password');
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            console.log('Passwords do not match');
            return res.render('auth/resetPassword', { layout: false, email });
        }

        let hashPassword = await bcrypt.hash(newPassword, 10);
        await Admin.findOneAndUpdate({ email }, { password: hashPassword }, { new: true });

        console.log('Password Reset Successful for:', email);
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/forgot-password');
    }
}

exports.registerPage = async (req, res) => {
    try {
        if(req.cookies && req.cookies.admin && req.cookies.admin._id != undefined)
            return res.redirect('/dashboard');

        return res.render('auth/register', { layout: false });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

exports.register = async (req, res) => {
    try {
        let existingAdmin = await Admin.findOne({ email: req.body.email });
        if (existingAdmin) {
            console.log('Email already exists');
            return res.redirect('/register');
        }

        let imagePath = req.file ? `/uploads/${req.file.filename}` : "";
        let hashPassword = await bcrypt.hash(req.body.password, 10);

        await Admin.create({
            ...req.body,
            password: hashPassword,
            profileImage: imagePath
        });

        console.log('Registration Successful');
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/register');
    }
}

exports.LogOutAdmin = async (req, res) => {
    try {
        res.clearCookie('admin');
        return res.redirect('/');
    } catch (error) {
        console.log(error)
        return res.redirect('/');
    }
}

exports.myProfile = async (req, res) => {
    try {
        if(req.cookies && req.cookies.admin && req.cookies.admin._id != undefined){
            let user = req.cookies.admin;
            return res.render('myProfile', { user });
        }
        else
            return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

exports.changePasswordPage = async (req, res) => {
    try {
        if(req.cookies && req.cookies.admin && req.cookies.admin._id != undefined){
            let user = req.cookies.admin;
            return res.render('auth/changePassWord', {user});
        }
        else
            return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { curPassword, newPassword, conPassword } = req.body;
        const user = req.cookies.admin;
        let verifyPass = await bcrypt.compare(curPassword, user.password);
        if(!verifyPass){
            console.log('Current password is not matched');
            return res.redirect('/change-password');
        }

        if(curPassword == newPassword){
            console.log('Current and New password is matched');
            return res.redirect('/change-password');
        }

        if(newPassword != conPassword){
            console.log('New password and confirm password is not matched');
            return res.redirect('/change-password');
        }

        let hashPassword = await bcrypt.hash(newPassword, 10);
        await Admin.findByIdAndUpdate(user._id, {password: hashPassword}, {new: true});
        console.log('Password Changed!!!');
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

exports.loginPage = async (req, res) => {
    try {
        if(req.cookies && req.cookies.admin && req.cookies.admin._id != undefined)
            return res.redirect('/dashboard');

        return res.render('auth/loginPage', { layout: false });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

exports.dashboardPage = async (req, res) => {
    try {
        if(req.cookies && req.cookies.admin && req.cookies.admin._id != undefined){
            let user = req.cookies.admin;
            return res.render('dashboard', {user});
        }
        else
            return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

exports.login = async (req, res) => {
    try {
        // login logic
        let admin = await Admin.findOne({email: req.body.email});
        if(!admin){
            console.log('Admin not found');
            return res.redirect('/');
        }

        let matchPass = await bcrypt.compare(req.body.password, admin.password);
        if(!matchPass){
            console.log('Invalid Credential');
            return res.redirect('/');
        }

        // console.log(admin);
        res.cookie('admin', admin);
        return res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}
