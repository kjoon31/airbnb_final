const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage } = require('../../db/models')

//get all spots
router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll({
    raw: true
  })
  for ( let i = 0; i < allSpots.length; i++) {
    let currentSpot = allSpots[i];
    const spotImage = await SpotImage.findOne({
      where: {
        spotId: currentSpot.id,
        preview: true
      },
      raw: true
    })
    if (spotImage) {
      currentSpot['previewImage'] = spotImage["url"]
    }
  // get all reviews for this spot
  // add all review scores together
  // divide by number of reviews
  // set avg rating to this number
  const reviews = await Review.findAll({
    raw: true
  })
  let sum = 0;
  for ( let i = 0; i < reviews.length; i++) {
    let currentReview = reviews[i];
    // console.log(currentReview)
    // console.log(currentReview["stars"])
    sum += currentReview["stars"]
  }
  sum /= reviews.length
  // console.log(sum)
  // console.log(currentSpot)
  currentSpot['avgRating'] = sum
  }
  return res.json(allSpots)
})

router.post('/', async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const user = req.user;
  if (!user) {
    return res.status(401).json("User not authenticated");
  }
  const spot = await Spot.create({
    ownerId: user.id,
    address,
    city, 
    state, 
    country, 
    lat, 
    lng, 
    name, 
    description, 
    price,
  })
  return res.json(spot)
})

router.post("/:id/images", async (req, res) => {
  const user = req.user;
  const { url, preview } = req.body;
  if (!user) {
    return res.status(401).json("User not authenticated");
  }

  let spot = await Spot.findByPk(req.params.id);

  if (spot === null) {
    return res.status(404).json("Spot not found!");
  }

  spot = await Spot.findOne({
    where: {
      id: req.params.id,
      ownerId: user.id
    }
  });

  if (spot === null) {
    return res.status(500).json("Spot does not exist or user not owner of spot!");
  }

  const spotImage = await SpotImage.create({
    spotId: spot.id,
    url,
    preview
  }) 

  return res.json(spotImage)
})

module.exports = router;