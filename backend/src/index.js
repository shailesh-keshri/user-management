const express = require('express');
const parser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const port = 3000;

const serviceAccount = require('../config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://user-management-c9dae.firebaseio.com'
})

app.use(parser.json());

//Basic routes
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});
  
// Import and use user routes
const userRoutes = require('./userRoutes');
app.use('/api/users', userRoutes);

// Create admin user if not exists
const createAdminUser = async () => {
  try {
    const userRecord = await admin.auth().getUserByEmail('admin@example.com');
    console.log('Admin user already exists');
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      await admin.auth().createUser({
        email: 'admin@example.com',
        emailVerified: true,
        password: 'defaultAdminPassword',
        displayName: 'Admin',
        disabled: false,
      });
      console.log('Admin user created');
    } else {
      console.error('Error fetching user data:', error);
    }
  }
};
createAdminUser();

app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
});
