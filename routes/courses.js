const { Router } = require("express");
const Course = require("../models/courseModel");
const authMW = require("../middleware/auth");

const router = Router();

router.get("/", async (req, res) => {
  const allCourses = await Course.find().populate("userId");
  // .select("price title")
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
    allCourses,
  });
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("course", {
    layout: "empty",
    title: "Course " + course.title,
    course,
  });
});

router.get("/:id/edit", authMW, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  const course = await Course.findById(req.params.id);
  res.render("courseEdit", {
    title: "Edit: " + course.title,
    course,
  });
});

router.post("/edit", authMW, async (req, res) => {
  const id = req.body.id;
  delete req.body.id; //удаляет поле id из объекта body
  await Course.findByIdAndUpdate(id, req.body);
  res.redirect("/courses");
});

router.post("/remove", authMW, async (req, res) => {
  try {
    const id = req.body.id;
    await Course.deleteOne({
      _id: id,
    });
    res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
