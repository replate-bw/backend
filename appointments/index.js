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

router.put("/:id", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message:
        "You must provide an 'authorization' header with a valid token in order to access this resource."
    });
  } else {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, decodedToken) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token" });
        } else {
          apptDb
            .findById(req.params.id)
            .then(appts => {
              const appt = appts[0];

              if (decodedToken.id !== appt.business_id) {
                return res.status(401).json({
                  message:
                    "Unauthorized: You may not update appointments that do not belong to you."
                });
              } else {
                if (appt) {
                  const morphed = {
                    ...appt,
                    ...req.body
                  };
                  const newAppt = {
                    id: appt.id,
                    quantity: morphed.quantity,
                    status: morphed.status,
                    time: morphed.time,
                    type: morphed.type,
                    business_id: morphed.business_id,
                    volunteer_id: morphed.volunteer_id
                  };
                  apptDb
                    .update(req.params.id, newAppt)
                    .then(entries => {
                      return res.status(202).json(newAppt);
                    })
                    .catch(err => {
                      console.log(err);
                      return res.status(500).json({
                        message:
                          "Internal failure when updating the specified appointment."
                      });
                    });
                } else {
                  return res.status(404).json({
                    message:
                      "The request appointment does not exist. Please provide a valid ID."
                  });
                }
              }
            })
            .catch(err => {
              console.log(err);
              return res.status(500).json({
                message: "Failed in retrieving the specified appointment."
              });
            });
        }
      }
    );
  }
});

router.delete("/:id", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message:
        "You must provide an 'authorization' header with a valid token in order to access this resource."
    });
  } else {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, decodedToken) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token" });
        } else {
          apptDb
            .findById(req.params.id)
            .then(appts => {
              const appt = appts[0];

              if (decodedToken.id !== appt.business_id) {
                return res.status(401).json({
                  message:
                    "Unauthorized: You may not delete appointments that do not belong to you."
                });
              } else {
                apptDb
                  .deleteById(req.params.id)
                  .then(affected => {
                    res.status(200).json(appt);
                  })
                  .catch(err => {
                    console.log(err);
                    return res
                      .status(500)
                      .json({
                        message:
                          "Appointment deletion failed due to an internal error."
                      });
                  });
              }
            })
            .catch(err => {
              console.log(err);
              return res.status(500).json({
                message: "Failed in retrieving the specified appointment."
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
              return res.status(400).json({
                message:
                  "Please provide 'time', 'quantity', 'type' and 'status' fields to create a new appointment."
              });
            } else {
              const newAppt = {
                time,
                quantity,
                type,
                status,
                business_id: decodedToken.id
              };

              apptDb
                .insert(newAppt)
                .then(id => {
                  newAppt.id = id[0];
                  res.status(201).json(newAppt);
                })
                .catch(err => {
                  console.log(err);
                  return res.status(500).json({
                    message:
                      "Failed to create appointment due to an internal error."
                  });
                });
            }
          }
        }
      }
    );
  }
});

module.exports = router;
