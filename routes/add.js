const { Router } = require("express");
const Course = require("../models/courseModel");
const authMW = require("../middleware/auth");
const { validationResult } = require("express-validator");
const { courseValidator } = require("../utils/validators");

const router = Router();

router.get("/", authMW, (req, res) => {
  res.render("add", {
    title: "Добавление",
    isAdd: true,
  });
});

router.post("/", authMW, courseValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("registerError", errors.array()[0].msg);
    return res.status(422).render("add", {
      title: "Add course",
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
      },
    });
  }
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
