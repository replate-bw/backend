const express = require("express");

const router = express.Router();

const jwt = require("jsonwebtoken");

const apptDb = require("../data/appointments");

router.get("/", (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).json({
      message:
        "You must provide an 'authorization' header with a valid token in order to access this resource."
    });
  } else {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, decodedToken) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Failed to authenticate due to an internal error"
          });
        } else {
          console.log(decodedToken);
          apptDb
            .findAll()
            .then(appts => {
              const appointments = appts.filter(appt => !appt.volunteer_id);

              return res.status(200).json(appointments);
            })
            .catch(err => {
              console.log(err);
              return res.status(500).json({
                message: "Failed to retrieve appointment data",
                detail: err
              });
            });
        }
      }
    );
  }
});

router.post("/", (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).json({
      message:
        "You must provide an 'authorization' header with a valid token in order to access this resource."
    });
  } else {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, decodedToken) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Failed to authenticate due to an internal error"
          });
        } else {
          console.log(decodedToken);
          if (decodedToken.accountType !== "business") {
            return res
              .status(401)
              .json({ message: "Must be a business to post an appointment." });
          } else {
            const { time, quantity, type, status } = req.body;

            if (
              !time ||
              !time.trim() ||
              !quantity ||
              !quantity.trim() ||
              !type ||
              !type.trim() ||
              !status ||
              !status.trim()
            ) {
              return res
                .status(400)
                .json({
                  message:
                    "Please provide 'time', 'quantity', 'type' and 'status' fields to create a new appointment."
                });
            } else {
              const newAppt = 
              {
                time, quantity, type, status,
                business_id: decodedToken.id
              };

              apptDb.insert(newAppt)
              .then(id => {
                newAppt.id = id[0];
                res.status(201).json(newAppt);
              })
              .catch(err => {
                console.log(err);
                return res.status(500).json({message: "Failed to create appointment due to an internal error."});
              });
            }
          }
        }
      }
    );
  }
});

module.exports = router;
