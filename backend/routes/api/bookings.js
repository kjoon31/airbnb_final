const express = require('express');
const router = express.Router();

//get all current user's bookings
router.get('/current')

//edit booking
router.put('/:id')

//delete booking
router.delete('/:id')

module.exports = router;