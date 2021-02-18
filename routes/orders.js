const { Router } = require("express");
const router = Router();
const Order = require("../models/orderModel");
const authMW = require("../middleware/auth");

router.get("/", authMW, async (req, res) => {
  try {
    const orders = await Order.find({
      "user.userId": req.user._id,
    })
      .populate("user.userId");
    res.render("orders", {
      isOrder: true,
      title: "Orders page",
      orders: orders.map((item) => {
        return {
          ...item._doc,
          price: item.courses.reduce((total, ite) => {
            return (total += ite.count * ite.course.price);
          }, 0),
        };
      }),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", authMW, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.courseId").execPopulate();
    const courses = user.cart.items.map((item) => ({
      count: item.count,
      course: { ...item.courseId._doc },
    }));
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses: courses,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect("/orders");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
