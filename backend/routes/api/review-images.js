const express = require('express');
const router = express.Router();
const { ReviewImage, Review } = require('../../db/models')

router.delete('/:id', async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({
      "message": "Authentication required"
    });
  }
  const reviewImage = await ReviewImage.findOne({
    where: {
      id: req.params.id,
    },
    raw: true
  })
  if(!reviewImage) {
    return res.status(404).json('Review Image does not exist')
  }
  const review = await Review.findOne({
    where: {
      id: reviewImage.reviewId
    }
  })
  
  if (review.userId !== user.id) {
    return res.status(403).json({
      "message": "Forbidden"
    })
  }
  await ReviewImage.destroy({
    where: {
      id: req.params.id
    }
  })
  return res.json('Review Image has been successfully deleted')
})


module.exports=router;