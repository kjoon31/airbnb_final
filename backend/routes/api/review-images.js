const express = require('express');
const router = express.Router();
const { ReviewImage, Review } = require('../../db/models');

//delete a review image

router.delete("/:id", async (req, res) => {
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

  await ReviewImage.destroy({
    where: {
      id: req.params.imageId,
      reviewId: req.params.id
    }
  });

  return res.json("Image successfully deleted");
});

module.exports = router;