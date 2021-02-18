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
const homeRoutes = require("./routes/home");
const coursesRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const sessionMW = require("./middleware/variables");
const userMW = require("./middleware/user");
const csrf = require('csurf');
const flash = require("connect-flash");
const app = express();

const PORT = process.env.PORT || 3000;
const password = "sviFRrX7Dv3hTUyv";
const dbName = "historyContent";
const connection =
  "mongodb+srv://Daniel:" + password + "@cluster0.paa0o.mongodb.net/" + dbName;

const hbs1 = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "mainMain",
  extname: "hbs",
});
const store = new MongoStore({
  collection: "sessions",
  uri: connection,
});

app.engine("hbs", hbs1.engine);
app.set("view engine", "hbs");
app.set("views", "pages");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "code",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrf());
app.use(flash());
app.use(sessionMW);
app.use(userMW);

app.use("/", homeRoutes);
app.use("/courses", coursesRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

const start = async () => {
  try {
    await mongoose.connect(connection, {
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
