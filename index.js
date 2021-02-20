const express = require("express");
const path = require("path");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const homeRoutes = require("./routes/home");
const coursesRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const sessionMW = require("./middleware/variables");
const userMW = require("./middleware/user");
const fileMW = require("./middleware/file");
const csrf = require("csurf");
const flash = require("connect-flash");
const app = express();
const errorMW = require("./middleware/error");
const { connectionDB, sessionSecret } = require("./keys");
const PORT = process.env.PORT || 3000;

const hbs1 = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "mainMain",
  extname: "hbs",
  helpers: require("./utils/hbs-helpers"),
});
const store = new MongoStore({
  collection: "sessions",
  uri: connectionDB,
});

app.engine("hbs", hbs1.engine);
app.set("view engine", "hbs");
app.set("views", "pages");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(fileMW.single("avatar"));
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(sessionMW);
app.use(userMW);

app.use("/", homeRoutes);
app.use("/courses", coursesRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/profile", profileRoutes);
app.use("/auth", authRoutes);

app.use(errorMW);

const start = async () => {
  try {
    await mongoose.connect(connectionDB, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
