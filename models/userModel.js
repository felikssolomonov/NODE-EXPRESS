const { Schema, model } = require("mongoose");

const userModel = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: String,
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
      },
    ],
  },
});

userModel.methods.addToCart = function (course) {
  const tempItems = [...this.cart.items];
  const index = tempItems.findIndex((item) => {
    return item.courseId.toString() === course._id.toString();
  });
  if (index >= 0) {
    tempItems[index].count = ++tempItems[index].count;
  } else {
    tempItems.push({
      courseId: course._id,
      count: 1,
    });
  }
  this.cart = { items: tempItems };
  return this.save();
};

userModel.methods.removeFromCart = function (id) {
  let tempItems = [...this.cart.items];
  const index = tempItems.findIndex((item) => {
    return item.courseId.toString() === id.toString();
  });
  if (tempItems[index].count === 1) {
    tempItems = tempItems.filter(
      (item) => item.courseId.toString() !== id.toString()
    );
  } else {
    tempItems[index].count--;
  }
  this.cart = { items: tempItems };
  return this.save();
};

userModel.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model("User", userModel);
