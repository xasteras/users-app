// Αν ήθελα να σπάσει περισσότερο η εφαρμογή και να φτιάξουμε ένα φάκελο Services και ο Controller δρομολογεί τα rwquest εδω
const User = require('../models/user.model');

function findAll() {              // φτιάχνουμε μια function 
  const result = User.find();
  return result;
}

function findOne(username) {      // φτιάχνουμε μια finction που δέχεται ως όρισμα ένα username
  const result = User.findOne({username:username});
  return result;
}

module.exports = { findAll, findOne }     // κάνουμε το export για να τα βρει ο Controller ή οποίο άλλο αρχείο θέκει να το χρησιμοποιήσει