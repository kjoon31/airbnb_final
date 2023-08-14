const express = require('express');
const router = express.Router();
const { SpotImage, Spot } = require("../../db/models")


router.delete('/:id', async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({
      "message": "Authentication required"
    });
  }
  const spotImage = await SpotImage.findOne({
    where: {
      id: req.params.id,
    },
    raw: true
  })
  if(!spotImage) {
    return res.status(404).json({
      "message": "Spot Image couldn't be found"
    })
  }
  const spot = await Spot.findOne({
    where: {
      id: spotImage.spotId
    }
  })
  if (spot.ownerId !== user.id) {
    return res.status(403).json({
      "message": "Forbidden"
    })
  }
  await SpotImage.destroy({
    where: {
      id: req.params.id
    }
  })
  return res.json({
    "message": "Successfully deleted"
  })
})

module.exports=router;