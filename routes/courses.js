const { Router } = require("express");
const Course = require("../models/courseModel");
const authMW = require("../middleware/auth");
const router = Router();

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

router.get("/", async (req, res) => {
  try {
    const allCourses = await Course.find().populate("userId");
    // .select("price title img");
    // метод .select указывает какие именно
    // поля мы получим из объекта Course
    // метод .populate("userId", "email name") просит
    // показывать не сам userId, а
    // брать параметры соответствующие данному юзеру
    // вторым параметром можно перечислить поля для
    // показа как в методе .select
    res.render("courses", {
      title: "Курсы",
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      allCourses,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render("course", {
      layout: "empty",
      title: "Course " + course.title,
      course,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/edit", authMW, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  try {
    const course = await Course.findById(req.params.id);
    if (!isOwner(course, req)) {
      return res.redirect("/courses");
    }
    res.render("courseEdit", {
      title: "Edit: " + course.title,
      course,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit", authMW, async (req, res) => {
  try {
    const id = req.body.id;
    delete req.body.id;
    const course = await Course.findById(id);
    if (!isOwner(course, req)) {
      return res.redirect("/courses");
    } else {
      await Course.findByIdAndUpdate(id, req.body);
      return res.redirect("/courses");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/remove", authMW, async (req, res) => {
  try {
    const courseId = req.body.id;
    const userId = req.user._id;
    await Course.deleteOne({
      _id: courseId,
      userId: userId,
    });
    res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
