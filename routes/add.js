const { Router } = require("express");
const Course = require("../models/courseModel");
const authMW = require("../middleware/auth");

const router = Router();

router.get("/", authMW, (req, res) => {
  res.render("add", {
    title: "Добавление",
    isAdd: true,
  });
});

router.post("/", authMW, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    image: req.body.image,
    userId: req.user._id, //req.user
  });
  try {
    await course.save();
    res.redirect("./courses");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
