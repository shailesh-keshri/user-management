const express = require("express");
const parser = require("body-parser");
const admin = require("firebase-admin");

const app = express();
const port = 3000;

const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "user-management-c9dae.appspot.com",
  databaseURL: "https://user-management-c9dae.firebaseio.com",
});

app.use(parser.json());

//Basic routes
app.get("/", (req, res) => {
  res.send("Backend Server is Runnig at Port "+port);
});

// Import and use user routes
const userRoutes = require("./userRoutes");
app.use("/api/users", userRoutes);

// Create admin user if not exists
const createAdminUser = async () => {
  try {
    const userRecord = await admin.auth().getUserByEmail("admin1@gmail.com");
    console.log("Admin user already exists");
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      const user = await admin.auth().createUser({
        email: "admin1@gmail.com",
        emailVerified: true,
        password: "Admin123",
        displayName: "SK Admin",
        disabled: false,
      });
      await admin.auth().setCustomUserClaims(user.uid, { roles: "admin" });
      await admin.firestore().collection("users").doc(user.uid).set({
        email: user.email,
        name: user.displayName,
        roles: "admin",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("Admin user created");
    } else {
      console.error("Error fetching user data:", error);
    }
  }
};

createAdminUser();

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
