const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = mongoose.model("User");
const Todo = require("../model/todo");

exports.register = function (req, res) {
  var newUser = new User(req.body);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function (err, user) {
    if (err) {
      return res.status(400).send({
        message: err,
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
    }
  });
};

exports.sign_in = function (req, res) {
  User.findOne(
    {
      email: req.body.email,
    },
    function (err, user) {
      if (err) throw err;
      if (!user || !user.comparePassword(req.body.password)) {
        return res.status(401).json({
          message: "Authentication failed. Invalid user or password.",
        });
      }
      return res.json({
        token: jwt.sign(
          { email: user.email, name: user.name, _id: user._id },
          "RESTFULAPIs"
        ),
      });
    }
  );
};

exports.loginRequired = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user!!" });
  }
};
exports.profile = function (req, res, next) {
  if (req.user) {
    res.send(req.user);
    next();
  } else {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.createTodoApp = function (req, res, next) {
  if (req.user) {
    console.log(req.body);
    const todoCreate = new Todo({
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      users: req.user._id,
    });

    return todoCreate
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          message: "New todo created successfully",
        });
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          message: "Server error. Please try again.",
          error: error.message,
        });
      });
  } else {
    return res.status(401).json({ message: "Invalid token" });
  }
};
