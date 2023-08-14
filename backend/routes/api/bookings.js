const express = require('express');
const router = express.Router();
const { Spot, User, Booking, SpotImage, Sequelize } = require('../../db/models');

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
  return res.json({
    "Bookings": bookings
  })
})

router.put('/:id', async (req, res)=> {
  const user = req.user
  const { startDate, endDate } = req.body
  if (!user) {
    return res.status(401).json('User not authenticated')
  }
  let booking = await Booking.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!booking) {
    return res.status(404).json("Booking does not exist")
  }
  if (booking.userId !== user.id) {
    return res.status(403).json('User not owner of booking')
  }
  if (booking.endDate < Sequelize.literal("CURRENT_TIMESTAMP")) {
    return res.status(400).json('Past booking end date')
  }
  let otherBooking = await Booking.findOne({
    where: {
      spotId: booking.id,
      startDate: Sequelize.literal(startDate),
      endDate: Sequelize.literal(endDate),
    },
    raw: true
  })
  // if (otherBooking) {
  //   console.log(otherBooking, startDate, endDate)
  //   return res.status(403).json('Booking already exists on dates')
  // }
  await booking.update(req.body);
  booking = await Booking.findByPk(req.params.id);
  return res.json(booking);
})
router.delete('/:id', async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json("User not authenticated");
  }
  const booking = await Booking.findOne({
    where: {
      id: req.params.id,
    },
    raw: true
  })
  if(!booking) {
    return res.status(404).json('Booking does not exist')
  }
  
  if (booking.userId !== user.id) {
    return res.status(403).json('Not owner of booking')
  }
  await Booking.destroy({
    where: {
      id: req.params.id
    }
  })
  return res.json('Booking has been successfully deleted')
})


module.exports=router;