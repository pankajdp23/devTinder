const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");

requestRouter.post("/sendConnectRequest", userAuth, async (req, res) => {
  const user = req.user;
  const userFirstName = user.firstName;
  console.log("Send connect request called");
  res.send(userFirstName + " Send connect request called");
});

module.exports = requestRouter;
