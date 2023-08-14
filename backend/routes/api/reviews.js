const express = require('express');
const router = express.Router();
const { User, Review, ReviewImage, Spot, SpotImage } = require('../../db/models');


router.post('/:id/images', async (req, res) => {
  const { url } = req.body
  const user = req.user
  if (!user) {
    return res.status(401).json("User not authenticated")
  }
  const reviewId = req.params.id
  // review
  const review = await Review.findOne({
    where: {
      id: reviewId
    },
    raw: true
  })
  if (review.userId !== user.id) {
    console.log(review, user)
    return res.status(403).json("User is not the owner of the Review");
  }
  if (!review) {
    return res.status(404).json('Review does not exist with the provided id')
  }
  let images = await ReviewImage.findAll({
    where: {
      reviewId: review.id
    }
  })
  if (images.length >= 10) {
    return res.status(403).json('Max number of images')
  }
  const image = await ReviewImage.create({
    reviewId: review.id,
    url,
  })
  return res.json(image)
})

router.get('/current', async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json("User not authenticated")
  }
  const reviews = await Review.findAll({
    where: {
      userId: user.id
    },
    raw: true
  })
  for ( let i = 0; i < reviews.length; i++) {
    let currentReview = reviews[i];
    const fetchedUser = await User.findOne({
      where: {
        id: currentReview.userId
      },
      raw: true
    })
    currentReview['User'] = fetchedUser
    const spot = await Spot.findOne({
      where: {
        id: currentReview.spotId
      },
      raw: true
    })
    const spotImage = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      },
      raw: true
    })
    spot['previewImage'] = null
    if (spotImage) {
      spot['previewImage'] = spotImage["url"]
    }
    const reviewImages = await ReviewImage.findAll({
      where: {
        reviewId: currentReview.id
      },  
      raw: true
    })
    currentReview['ReviewImages'] = reviewImages
    currentReview['Spot'] = spot
    }
  return res.json(reviews)
})

router.put("/:id", async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json("User not authenticated");
  }


  let review = await Review.findByPk(req.params.id);

  if (review === null) {
    return res.status(404).json("Review not found!");
  }

  if (review.userId !== user.id) {
    return res.status(403).json("User is not the owner of the Review");
  }
  await review.update(req.body);
  review = await Review.findByPk(req.params.id);
  return res.json(review);
});
module.exports = router;