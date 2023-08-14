const express = require('express');
const router = express.Router();
const { Spot, User, Booking, SpotImage } = require('../../db/models');

//get all current user's bookings
router.get('/current', async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json("User not authenticated");
  }
  const bookings = await Booking.findAll({
    where: {
      userId: user.id,
    },
    raw: true
  })
  for (let booking of bookings) {
    let spot = await Spot.findOne({
      where: {
        id: booking["spotId"]
      },
      raw: true
    })
    console.log(spot)
    const spotImage = await SpotImage.findOne({
      where: {
        spotId: spot['id'],
        preview: true
      },
      raw: true
    })
    spot['previewImage'] = null
    if (spotImage) {
      spot['previewImage'] = spotImage["url"]
    }
    booking["Spot"] = spot
  }
  return res.json(bookings)
})


module.exports=router;