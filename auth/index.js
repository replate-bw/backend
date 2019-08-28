const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const userDb = require("../data/users");

const router = express.Router();

router.post("/login", (req, res) => {
  if (
    req.body.email &&
    req.body.password &&
    req.body.email.trim() &&
    req.body.password.trim()
  ) {
    userDb
      .findByEmail(req.body.email)
      .then(users => {
        const user = users[0];
        const password = user ? user.password : "";
        if (!user || !password) {
          console.log(password);
          console.log(user);
          return res
            .status(401)
            .json({ message: "Invalid email/password combination." });
        } else {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            const response = {
              id: user.id,
              token: getJwt(user),
              name: user.name,
              contact: {
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone
              },
              address: user.address,
              email: user.email,
              accountType: user.account_type
            };
            return res.status(200).json(response);
          } else {
            return res
              .status(400)
              .json({ message: "Invalid email/password combination." });
          }
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({
          message: "Internal Error: Unable to retrieve specified user.",
          detail: err
        });
      });
  } else {
    return res
      .status(400)
      .json({ message: "Please provide a 'email' and 'password'!" });
  }
});

router.post("/signup", (req, res) => {
  if (
    !req.body.password ||
    !req.body.password.trim() ||
    !req.body.firstName ||
    !req.body.firstName.trim() ||
    !req.body.lastName ||
    !req.body.lastName.trim() ||
    !req.body.email ||
    !req.body.email.trim() ||
    !req.body.accountType ||
    !req.body.accountType.trim()
  ) {
    return res.status(400).json({
      message:
        "Please make sure to provide 'firstName', 'lastName', 'email', 'password' and 'accountType' as those are required fields."
    });
  } else {
    if (req.body.accountType !== "business" && req.body.accountType !== "volunteer") {
      return res
        .status(400)
        .json({
          message:
            "Invalid value for account type: " +
            accountType +
            ". Valid options are ['volunteer', 'business']"
        });
    } else {
      const newEntity = {
        name: req.body.name,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        accountType: req.body.accountType
      };
      const fullEntity = {
        ...newEntity,
        password: bcrypt.hashSync(req.body.password, 12)
      };
      userDb
        .findByEmail(req.body.email)
        .then(result => {
          if (result.length !== 0) {
            return res.status(400).json({
              message:
                "A user with that email already exists! Please use a different email address."
            });
          } else {
            userDb
              .insert(fullEntity)
              .then(id => {
                newEntity.id = id[0];
                newEntity.token = getJwt(newEntity);

                return res.status(200).json(newEntity);
              })
              .catch(err => {
                console.log(err);
                return res
                  .status(500)
                  .json({ message: "Failed to create user.", detail: err });
              });
          }
        })
        .catch(err => {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Internal Error: Unable to complete signup." });
        });
    }
  }
});

function getJwt(user) {
  const payload = {
    accountType: user.account_type || user.accountType,
    name: user.name,
    id: user.id
  };
  const secret = process.env.JWT_SECRET;
  const options = {};
  return jwt.sign(payload, secret, options);
}

module.exports = router;
