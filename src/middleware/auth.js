const jwt = require("jsonwebtoken");
const User = require("../model/user");
const bcrypt = require("bcryptjs");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const decodedObj = jwt.verify(token, "devTinder@123");

    const user = await User.findById(decodedObj.id);

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = userAuth;
