const { body } = require("express-validator");
const User = require("../models/userModel");

exports.registerValidator = [
  body("name", "incorrect name").isLength({ min: 5, max: 20 }),
  body("email")
    .isEmail()
    .withMessage("enter correct email")
    .normalizeEmail()
    .trim()
    .custom(async (value, { req }) => {
      try {
        const candidate = await User.findOne({ email: value });
        if (candidate) {
          return Promise.reject("email already in use");
        }
      } catch (error) {
        console.log(error);
      }
    }),
  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("incorrect length of password")
    .isAlphanumeric()
    .trim()
    .withMessage({
      message: "password must contain letters and numbers",
      errorCode: 1,
    }),
  body("confirmpassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do't coincide");
      }
      return true;
    })
    .trim(),
];

exports.courseValidator = [
  body("title")
    .isLength({ min: 3, max: 20 })
    .withMessage("error length")
    .trim(),
  body("price").isNumeric().withMessage("not a number"),
  body("image", "url is not correct").isURL(),
];
