// userRoutes.js
const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

router.post('/createUser', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });
    res.status(201).send(userRecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/assignRole', async (req, res) => {
  const { uid, role } = req.body;
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    res.status(200).send({ message: 'Role assigned' });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/removeUser', async (req, res) => {
  const { uid } = req.body;
  try {
    await admin.auth().deleteUser(uid);
    res.status(200).send({ message: 'User removed' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
