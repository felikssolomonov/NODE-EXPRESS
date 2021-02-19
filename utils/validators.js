const { body } = require("express-validator");

exports.registerValidator = [
  body("name", "incorrect name").isLength({ min: 5, max: 20 }),
  body("email").isEmail().withMessage("enter correct email"),
  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("incorrect length of password")
    .isAlphanumeric()
    .withMessage({
      message: "password must contain letters and numbers",
      errorCode: 1,
    }),
  body("confirmpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do't coincide");
    }
    return true;
  }),
];
