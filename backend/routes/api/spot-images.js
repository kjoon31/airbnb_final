const express = require('express');
const router = express.Router();
const { SpotImage, Spot } = require("../../db/models")


router.delete('/:id', async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json("User not authenticated");
  }
  const spotImage = await SpotImage.findOne({
    where: {
      id: req.params.id,
    },
    raw: true
  })
  if(!spotImage) {
    return res.status(404).json('Spot image does not exist')
  }
  const spot = await Spot.findOne({
    where: {
      id: spotImage.spotId
    }
  })
  if (spot.ownerId !== user.id) {
    return res.status(403).json('Not owner of spot')
  }
  await SpotImage.destroy({
    where: {
      id: req.params.id
    }
  })
  return res.json('Spot successfully deleted')
})

module.exports=router;