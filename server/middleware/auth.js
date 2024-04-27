const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.headers["authtoken"];

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("Error verifying token", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}