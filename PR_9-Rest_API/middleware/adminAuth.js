const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {

    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }


    token = token.split(" ")[1];


    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized, admin only" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = adminAuth;
