const jwt = require("jsonwebtoken");

const employeeAuth = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.json({ message: "No token, access denied" });
    }

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "employee") {
      return res.json({ message: "Not authorized, employee only" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.json({ message: "Token is not valid" });
  }
};

module.exports = employeeAuth;
