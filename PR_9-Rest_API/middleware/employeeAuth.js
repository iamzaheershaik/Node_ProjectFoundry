const jwt = require("jsonwebtoken");

const employeeAuth = (req, res, next) => {
  try {
    // get token from header
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // remove "Bearer " from token
    token = token.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check role
    if (decoded.role !== "employee") {
      return res.status(403).json({ message: "Not authorized, employee only" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = employeeAuth;
