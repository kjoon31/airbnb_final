const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotRouter = require('./spots.js');
// const bookingRouter = require('./bookings.js');
const reviewRouter = require('./reviews.js');
// const spotImageRouter = require('./spot-images.js')
// const reviewImageRouter = require('./review-images.js')
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.get('/hello/world', function(req, res) {
  // res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotRouter);
// router.use('/bookings', bookingRouter);
router.use('/reviews', reviewRouter);
// router.use('/spots-images', spotImageRouter);
// router.use('/review-images', reviewImageRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;