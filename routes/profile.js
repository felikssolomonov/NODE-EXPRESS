const { Router } = require("express");
const router = Router();
const User = require("../models/userModel");
const authMW = require("../middleware/auth");

router.get("/", authMW, async (req, res) => {
  res.render("profile", {
    title: "Profile",
    isProfile: true,
    user: req.user.toObject(),
  });
});

router.post("/", authMW, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const toChange = {
      name: req.body.name,
    };
    if (req.file) {
      toChange.avatarUrl = req.file.path;
    }
    Object.assign(user, toChange);
    await user.save();
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
