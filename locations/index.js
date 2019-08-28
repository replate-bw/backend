const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const locDb = require('../data/locations');

router.get('/', (req, res) => {
  locDb.find()
  .then(locations => {
    if(!req.headers.authorization)  return res.status(401).json({message: "Unauthorized: Provide a token in header in order to update locations."});
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decodedToken) => {
      if(err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      const locationList = locations.filter(loc => loc.business_id === decodedToken.id);
      return res.status(200).json(locationList);
    });
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({message: "Failed to retrieve locations due to an internal error."});
  })
});

router.delete('/:id', (req, res) => {
  if(!req.headers.authorization)  return res.status(401).json({message: "Unauthorized: Provide a token in header in order to update locations."});
  jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decodedToken) => {
    if(err) return res.status(401).json({message: "Unauthorized: Invalid token"});
    locDb.findById(req.params.id)
    .then(loc => {
      if(loc.length === 0)  return res.status(404).json({message: "A location with the specified ID does not exist"});
      if(loc[0].business_id !== decodedToken.id) return res.status(401).json({message: "Unauthorized: Specified ID doesn't match any locations belonging to specified user."});
      locDb.deleteById(req.params.id)
      .then(() => {
        locDb.findByUser(decodedToken.id)
        .then(locations => {
          return res.status(200).json(locations);
        })
        .catch(err => {
          console.log(err);
          return res.status(200).json({message: "Deleted successfully - but failed to retrieve remaning locations"});
        })
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({message: "Failed to delete location due to an internal error"});
      });
      
    })
  });
});

router.post('/', (req, res) => {
  if(!req.headers.authorization) {
    return res.status(401).json({message: "Unauthorized: Provide a token in header in order to update locations."});
  } else {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, decodedToken) => {
        if(err) {
          console.log(err);
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token" });
        } else {
          if(decodedToken.accountType !== 'business') {
            return res.status(401).json({message: "Only a business account may update locations."});
          } else {
            if(!req.body.address || !req.body.city || !req.body.state || !req.body.zip) {
              return res.status(400).json({message: "Please provide the 'address', 'city', 'state' and 'zip' fields as they are required."});
            }
            const newLocation = {
              address: req.body.address.trim(),
              city: req.body.city.trim(),
              state: req.body.state.trim(),
              zip: req.body.zip,
              business_id: decodedToken.id
            }
            locDb.insert(newLocation)
            .then(id => {
              newLocation.id = id[0];
              return res.status(200).json(newLocation);
            })
            .catch(err => {
              console.log(err);
              return res.status(500).json({message: "Failed to create location due to an internal error."});
            });
          }
        }
      });
  }
})

module.exports = router;