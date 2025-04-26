const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const usersDb = require('../db/users');

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await usersDb.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const newUser = await usersDb.createUser({ ...userData, password_hash });
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await usersDb.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
  try {
    await usersDb.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
