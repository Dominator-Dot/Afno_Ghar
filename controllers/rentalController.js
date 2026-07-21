const RentalModel = require('../models/rentalModel');

async function createRental(req, res) {
  const { productId, productName, userName, userPhone, citizenNumber, address } = req.body;

  if (!productName || !userName || !userPhone || !citizenNumber || !address) {
    return res.status(400).json({ error: 'Missing required rental fields' });
  }

  try {
    // req.userId comes from the JWT (authenticateToken middleware), not
    // from the request body -- so a rental is always tied to whoever is
    // actually logged in, not to a client-supplied email/id.
    const rental = await RentalModel.createRental({
      productId,
      productName,
      userId: req.userId,
      userName,
      userPhone,
      citizenNumber,
      address,
    });
    res.status(201).json({ rental });
  } catch (error) {
    console.error('Create rental error:', error);
    res.status(500).json({ error: 'Failed to submit rental request' });
  }
}

async function listMyRentals(req, res) {
  try {
    const rentals = await RentalModel.findAllForUser(req.userId);
    res.json(rentals);
  } catch (error) {
    console.error('List rentals error:', error);
    res.status(500).json({ error: 'Failed to fetch rentals' });
  }
}

module.exports = {
  createRental,
  listMyRentals,
};
