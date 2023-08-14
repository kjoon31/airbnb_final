const express = require('express');
const router = express.Router();
const { User, Review, ReviewImage } = require('../../db/models');

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
module.exports = router;