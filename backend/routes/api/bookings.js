const express = require('express');
const router = express.Router();
const { User, Booking } = require('../../db/models');
const booking = require('../../db/models/booking');

//get all current user's bookings
router.get('/current', async (req, res) => {
  const user = req.user
  const bookings = await Booking.findAll({
    where: {
      id,
      spotId,  
      userId: user.id,
      startDate: booking.startDate,
      endDate: booking.endDate
    }
  })
})

//edit booking
router.put('/:id')

//delete booking
router.delete('/:id')

module.exports = router;