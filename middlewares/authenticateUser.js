const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

// Load environment variables from .env file
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.SECRET_KEY); // Use the SECRET_KEY variable from .env file

    req.user = await User.findByPk(decoded.id);

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

module.exports = authenticateUser;
