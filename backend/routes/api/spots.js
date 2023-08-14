const express = require('express');
const router = express.Router();
const { User, Spot, Review, SpotImage } = require('../../db/models');

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
    currentSpot['previewImage'] = null
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

router.get("/current", async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json("User not authenticated");
  } 

  const spots = await Spot.findAll({
    where: {
      ownerId: user.id
    },
    raw: true
  })

  for (let i = 0; i < spots.length; ++i) {
    let currentSpot = spots[i];

    const spotImage = await SpotImage.findOne({
      where: {
        spotId: currentSpot.id,
        preview: true
      },
      raw: true
    })
    currentSpot['previewImage'] = null
    if (spotImage) {
      currentSpot['previewImage'] = spotImage["url"]
    }

    const reviews = await Review.findAll({
      where: {
        spotId: currentSpot.id,
      },
      raw: true
    })
    let sum = 0;
    for ( let i = 0; i < reviews.length; i++) {
      let currentReview = reviews[i];
      sum += currentReview["stars"]
    }
    sum /= reviews.length
    currentSpot['avgRating'] = sum
  }

  return res.json(spots);
});

router.get("/:id", async (req, res) => {
  let spot = await Spot.findByPk(req.params.id);
  if (spot === null) {
    return res.status(404).json("Spot does not exist!");
  }

  spot = await Spot.findOne({
    where: {
      id: req.params.id 
    },
    raw: true,
  })
  const reviews = await Review.findAll({
    where: {
      spotId: spot.id,
    },
    raw: true
  })
  let sum = 0;
  for ( let i = 0; i < reviews.length; i++) {
    let currentReview = reviews[i];
    sum += currentReview["stars"]
  }
  sum /= reviews.length
  spot['avgStarRating'] = sum
  spot['numReviews'] = reviews.length
  // console.log(spot)
  const spotImages = await SpotImage.findAll({
    where: {
      spotId: spot.id,
    },
    raw: true
  })
  spot['SpotImages'] = spotImages

  const user = await User.findAll({
    where: {
      id: spot.ownerId
    },
    raw: true
  })
  spot['Owner'] = user
  return res.json(spot)
})

router.put("/:id", async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json("User not authenticated");
  }

  let spot = await Spot.findByPk(req.params.id);

  if (spot === null) {
    return res.status(404).json("Review not found!");
  }

  if (spot.ownerId !== user.id) {
    return res.status(403).json("User is not the owner of the Spot");
  }

  try {
    await spot.update(req.body);
    spot = await Spot.findByPk(req.params.id);
    return res.json(spot);
  } catch (error) {
    return res.status(400).json("Invalid request");
  }
});

router.post("/:id/reviews", async (req, res) => {
  const user = req.user;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(req.params.id);
  if (spot === null) {
    return res.status(404).json("Spot does not exist!");
  }

  const reviews = await Review.findAll({
    where: {
      userId: user.id,
      spotId: spot.id, 
    }
  })

  if (reviews.length > 0) {
    return res.status(403).json("User already reviewed spot")
  }

  const createdReview = await Review.create({
    spotId: spot.id,
    userId: user.id,
    review,
    stars
  });

  return res.status(201).json({
    id: createdReview.id,
    userId: createdReview.userId,
    spotId: createdReview.spotId,
    review: createdReview.review,
    stars: createdReview.stars,
    createdAt: createdReview.createdAt,
    updatedAt: createdReview.updatedAt
  })
})

module.exports = router;