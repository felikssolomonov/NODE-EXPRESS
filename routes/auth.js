const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/userModel");
const router = Router();

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Login",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError")
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const pass = await bcryptjs.compare(password, candidate.password);
      if (pass) {
        req.session.user = candidate;
        req.session.isAuthentificated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "email or password is not good");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "user is not found");
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      req.flash("registerError", "email duplicate in db");
      res.redirect("/auth/login#register");
    } else {
      const hashPassword = await bcryptjs.hash(password, 10);
      const user = new User({
        name: name,
        email: email,
        password: hashPassword,
        cart: {
          items: [],
        },
      });
      await user.save();
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
