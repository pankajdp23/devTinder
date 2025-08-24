const express = require("express");
const app = express();
const authenticate = require("./middleware/auth");
const connectDB = require("./config/database");
const User = require("./model/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error creating user", err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmailId = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmailId });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user); // Only send one response
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // Only send one response
  } catch (err) {
    console.error(err);
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  // Only check allowed fields, ignore userId
  const updateData = { ...req.body };
  delete updateData.userId;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(updateData).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (updateData?.skills?.length > 10) {
      throw new Error("You can not add more than 10 skills");
    }
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, updateData, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    console.error(err);
    res.status(400).send("Something went wrong. " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
