const { Router } = require("express");
const Course = require("../models/courseModel");
const authMW = require("../middleware/auth");
const router = Router();

const mapCartItems = (cart) => {
  return cart.items.map((item) => {
    return {
      ...item.courseId._doc,
      id: item.courseId.id,
      count: item.count
    };
  });
};

const getPrice = (courses) => {
  return courses.reduce((total, course) => {
    return (total += course.price * course.count);
  }, 0);
};

router.post("/add", authMW, async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect("/card");
});

router.delete("/remove/:id", authMW, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.courseId").execPopulate();
  const courses = mapCartItems(user.cart);
  const card = {
    courses,
    price: getPrice(courses),
  };
  res.status(200).json(card);
});

router.get("/", authMW, async (req, res) => {
  const user = await req.user.populate("cart.items.courseId").execPopulate();
  const courses = mapCartItems(user.cart);
  res.render("card", {
    title: "Basket",
    isCard: true,
    courses: courses,
    price: getPrice(courses),
  });
});

module.exports = router;
