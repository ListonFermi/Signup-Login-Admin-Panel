const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const dotenv = require("dotenv");
const morgan = require("morgan");

//dot env config
dotenv.config();

//Logger
app.use(morgan("dev"));

///M
require("./models/databaseModel.js");
require("./models/userModel.js");

// for not storing cache
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

//  Setting view Engine
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public"))); // for adding external files to view engine


// Creating a session
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "my secret",
  })
);

//parsing url- should be added before adding routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Adding routes
app.use(userRoutes);
app.use(adminRoutes);

//Port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
