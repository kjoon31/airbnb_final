const express = require('express');
const router = express.Router();

const { Spot, SpotImage } = require('../../db/models')

router.delete('/:id', async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json("User not authenticated");
  }

  let spot = await Spot.findByPk(req.params.id);

  if (spot === null) {
    return res.status(404).json("Spot not found!");
  }

  if (spot.ownerId !== user.id) {
    return res.status(403).json("User is not the owner of the Spot");
  }

  await SpotImage.destroy({
    where: {
      id: req.params.id,
      spotId: spot.id
    }
  });

  return res.json("Image successfully deleted");
});
module.exports = router;