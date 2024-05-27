// userRoutes.js
const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

router.post("/createUser", async (req, res) => {
  const { displayName, email, password, roles } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      displayName,
      email,
      password,
      emailVerified: true,
      disabled: false,
    });
    await admin.auth().setCustomUserClaims(userRecord.uid, { roles });

    // Store user information in Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email: userRecord.email,
      displayName: userRecord.displayName,
      roles,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // Fetch the user to confirm the claims and Firestore update
    const updatedUserRecord = await admin.auth().getUser(userRecord.uid);
    const { customClaims } = updatedUserRecord;
    const firestoreUser = await admin
      .firestore()
      .collection("users")
      .doc(userRecord.uid)
      .get();
    const userData = firestoreUser.data();

    // Ensure complete data is returned
    res.status(201).send({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      roles: customClaims.roles || userData.roles, // fallback to Firestore if claims are not set immediately
    });
    // res.status(201).send(userRecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/updateUser", async (req, res) => {
  const { uid, displayName, email, password, roles, emailVerified, disabled } =
    req.body;
  try {
    await admin.auth().updateUser(uid, {
      displayName,
      email,
      password,
      emailVerified,
      disabled,
    });
    await admin.auth().setCustomUserClaims(uid, { roles });

    // Update user information in Firestore
    await admin.firestore().collection("users").doc(uid).update({
      displayName,
      email,
      roles,
    });

    res.status(200).send({ message: "User updated" });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/assignRole", async (req, res) => {
  const { uid, roles } = req.body;
  try {
    await admin.auth().setCustomUserClaims(uid, { roles });

    // Update user roles in Firestore
    await admin.firestore().collection("users").doc(uid).update({ roles });

    res.status(200).send({ message: "Role assigned" });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/removeUser", async (req, res) => {
  const { uid } = req.body;
  try {
    await admin.auth().deleteUser(uid);

    // Remove user information from Firestore
    await admin.firestore().collection("users").doc(uid).delete();

    res.status(200).send({ message: "User removed" });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/getAllUsers", async (req, res) => {
  try {
    const listUsers = await admin.auth().listUsers();
    const users = await Promise.all(
      listUsers.users.map(async (userRecord) => {
        const { uid, email, displayName } = userRecord.toJSON();
        const userClaims = await admin.auth().getUser(uid);
        const roles = userClaims.customClaims
          ? userClaims.customClaims.roles
          : undefined;

        // Get additional data from Firestore if needed
        const firestoreUser = await admin
          .firestore()
          .collection("users")
          .doc(uid)
          .get();
        const firestoreData = firestoreUser.exists ? firestoreUser.data() : {};

        return {
          uid,
          email,
          displayName: displayName || firestoreData.displayName,
          roles: roles || firestoreData.roles,
        };
      })
    );
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/getUser/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const userRecord = await admin.auth().getUser(uid);
    const { email, displayName } = userRecord.toJSON();
    res.status(200).send({ uid, email, displayName });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
