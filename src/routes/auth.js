const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { validateSignupData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  const user = new User(req.body);

  const { firstName, lastName, emailId, password } = req.body;

  try {
    validateSignupData(req);
    const { password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    } else {
      const isPasswordMatch = await user.passValidation(password);
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 86400000),
        httpOnly: true,
      });
      if (!isPasswordMatch) {
        return res.status(404).send("Invalid credentials");
      } else {
        res.send("Login successful");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Something went wrong");
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logout successful");
});

module.exports = authRouter;
