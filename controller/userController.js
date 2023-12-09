const userCollection = require("../models/userModel");
const bcrypt = require("bcrypt");
const fs = require("fs");

const userSignup = async (req, res) => {
  let encryptedPassword = await bcrypt.hash(req.body.password, 10);

  let newUser = new userCollection({
    username: req.body.username,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    password: encryptedPassword,
  });
  const thisUser = await userCollection.findOne({ email: req.body.email });

  if (!thisUser) {
    req.session.user = true;
    newUser.save();
    req.session.email = req.body.email;
    res.redirect("/home");
    fs.appendFile(
      "./userLog.txt",
      `New user '${req.body.username}' registered at ${Date()}\n`,
      (err) => {
        if (err) console.log(err);
      }
    );
  } else {
    req.session.emailExists = true;
    res.redirect("/");
  }
};

const userHome = async (req, res) => {
  const thisUser = await userCollection.findOne({ email: req.session.email });
  if (req.session.user) {
    res.render("usersViews/userHomePage", { thisUser });
  } else {
    res.redirect("/");
  }
};

const userLogin = async (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else if (req.session.admin) {
    res.redirect("/adminHome");
  } else {
    res.render("usersViews/userLoginPage", {
      invalidCredentials: req.session.invalidCredentials,
      emailExists: req.session.emailExists,
    });
    req.session.emailExists = false;
    req.session.invalidCredentials = false;
  }
};

const userVerification = async (req, res) => {
  const existingUser = await userCollection.findOne({
    email: req.body.email,
  });
  console.log(existingUser);
  if (existingUser) {
    const comparePass = bcrypt.compareSync(
      req.body.password,
      existingUser.password
    );
    if (req.body.email == existingUser.email && comparePass) {
      req.session.user = true;
      req.session.email = req.body.email;
      res.redirect("/home");
      fs.appendFile(
        "./userLog.txt",
        `Existing user '${existingUser.username}' registered at ${Date()}\n`,
        (err) => {
          if (err) console.log(err);
        }
      );
    } else {
      req.session.invalidCredentials = true;
      res.redirect("/");
    }
  } else {
    req.session.invalidCredentials = true;
    res.redirect("/");
  }
};

const userLogout = async (req, res) => {
  req.session.user = false;
  res.redirect("/");
};

module.exports = {
  userSignup,
  userHome,
  userLogin,
  userVerification,
  userLogout,
};
