const adminCollection = require("../models/adminModel");
const userCollection = require("../models/userModel");
const bycrypt = require("bcrypt");
const fs=require('fs')

const adminHome = async (req, res) => {
  if (req.session.search) {
    var allUsers = req.session.search;
    res.render("adminViews/adminHomepage", { allUsers });
  } else {
    if (req.session.admin) {
      var allUsers = await userCollection.find();
      res.render("adminViews/adminHomepage", { allUsers });
    } else {
      res.redirect("/admin");
    }
  }
};

const adminLogin = async (req, res) => {
  if (req.session.admin) {
    res.redirect("/adminHome");
  } else {
    res.render("adminViews/adminLoginPage", {
      invalidCredentials: req.session.adminInvalidCredentials,
    });
    req.session.adminInvalidCredentials = false;
  }
};

const adminVerification = async (req, res) => {
  const existingAdmin = await adminCollection.findOne({
    email: req.body.email,
  });

  if (
    existingAdmin.email == req.body.email &&
    existingAdmin.password == req.body.password
  ) {
    req.session.admin = true;
    res.redirect("/adminHome");
    fs.appendFile(
      "./adminLog.txt",
      `Admin Liston logged in at ${Date()}\n`,
      (err) => {
        if (err) console.log(err);
      }
    );
  } else {
    req.session.adminInvalidCredentials = true;
    res.redirect("/admin");
  }
};

const adminLogout = async (req, res) => {
  req.session.admin = false;
  res.redirect("/admin");
};

const searchUser = async (req, res) => {
  var search = req.body.search;
  var searchedUser = await userCollection.find({
    $or: [
      { username: { $regex: search, $options: "i" } },
      //   { email: { $regex: ".*" + search + ".*", $options: "i" } }
    ],
  });
  if (searchedUser.length == 0) {
    req.session.search = null;
  }
  req.session.search = searchedUser;
  res.redirect("/adminHome");
};

const addUser = async (req, res) => {
  const encryptedPassword = bycrypt.hashSync(req.body.password, 10);
  const newUser = new userCollection({
    username: req.body.username,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    password: encryptedPassword,
  });
  const checkEmail = await userCollection.findOne({ email: req.body.email });
  if (checkEmail) {
    res.send("Email already exists");
  } else {
    newUser.save();
    console.log(newUser);
    res.redirect("/adminHome");
  }
};

const editUser = async (req, res) => {
  const updateUser = await userCollection.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: req.body.password,
      },
    }
  );
  res.redirect("/adminHome");
};

const editUserPage = async (req, res) => {
  const userData = await userCollection.findOne({ _id: req.query.id });
  if (req.session.admin) {
    res.render("adminViews/adminHomepage_editUser", { userData });
  } else {
    redirect("/adminHome");
  }
};

const deleteUser = async (req, res) => {
  const deletion = await userCollection.findByIdAndDelete({
    _id: req.query.id,
  });
  if (req.session.admin) {
    res.redirect("/adminHome");
  } else {
    res.redirect("/adminHome");
  }
};

module.exports = {
  adminHome,
  adminLogin,
  adminVerification,
  adminLogout,
  addUser,
  editUser,
  editUserPage,
  deleteUser,
  searchUser,
};
