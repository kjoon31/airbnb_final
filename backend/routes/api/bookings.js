const express = require('express');
const router = express.Router();
const { Spot, User, Booking, SpotImage, Sequelize } = require('../../db/models');

//get all current user's bookings
router.get('/current', async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({
      "message": "Authentication required"
    });
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
    return res.status(401).json({
      "message": "Authentication required"
    })
  }
  let booking = await Booking.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!booking) {
    return res.status(404).json({
      "message": "Booking couldn't be found"
    })
  }
  if (booking.userId !== user.id) {
    return res.status(403).json({
      "message": "Forbidden"
    })
  }
  // console.log(new Date(booking.endDate))
  // console.log(Date.now())
  // console.log((new Date(booking.endDate) < Date.now()))
  if (new Date(booking.endDate) < Date.now()) {
    return res.status(403).json({
      "message": "Past bookings can't be modified"
    })
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
    return res.status(401).json({
      "message": "Authentication required"
    });
  }
  const booking = await Booking.findOne({
    where: {
      id: req.params.id,
    },
    raw: true
  })
  if(!booking) {
    return res.status(404).json({
      "message": "Booking couldn't be found"
    })
  }
  
  if (booking.userId !== user.id) {
    return res.status(403).json({
      "message": "Forbidden"
    })
  }
  if (new Date(booking.startDate) < Date.now()) {
    return res.status(403).json({
      "message": "Bookings that have been started can't be deleted"
    })
  }

  await Booking.destroy({
    where: {
      id: req.params.id
    }
  })
  return res.json({
    "message": "Successfully deleted"
  })
})


module.exports=router;