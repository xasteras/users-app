const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.get('/google/callback', authController.googleLogin);

module.exports = router


// Αυτό αν το κάνουμε paste σε ένα browser μπαίνουμε στα στοιχεία του user με το payload, με πηγαίνει στο localhost:3000/api/auth/google/callback?code.....

// https://accounts.google.com/o/oauth2/auth?client_id=49291455257-p295u853vt861qredqvkvg24m29req43.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/google/callback&response_type=code&scope=email%20profile&access_type=offline