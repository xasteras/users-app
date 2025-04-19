const User = require('../models/user.model');   // εκχωρώ το userSchema που έχω στο user.model
const userService = require('../services/user.services');     // για να πάρουμε τα functions απο το φακελο services
const bcrypt = require('bcrypt');               // εκχωρούμε όλες τις μεθόδους και τις ιδιότητες που έχει η βιβλιοθήκη bcrypt
const logger = require('../logger/logger')      // στην μεταβλητή logger εκχώρησε ότι έχει γίνει export απο το αρχείο logger/logger

// Μια διαδικασία για να επιστρέφει όλους τους χρήστες
exports.findAll = async(req, res) => {          // χρήση async
  console.log("Find all users from collection users");

  try {
    // const result = await User.find();        // απο το σχήμα User που έχω του λέω επιστρεψέ μου όλους τους users της Collection Users
    const result = await userService.findAll(); // αντι να τρέχει απο το Controller οπως η πάνω τωρα τρέχει απο το Service
    res.status(200).json({status: true, data: result});   // Αν βρεις τους users επιστρεψέ τους με ένα status 200, JSON το οποίο θα περιέχει μια μεταβλητή status = true και σε μία άλλη μεταβήτή data το αποτέλεσμα αυτού του find

    logger.info("INFO, Success in reading all users");    // εμφάνιση πληροφορίας που έχει γίνει log

  } catch (err) {                               
    console.log("Problem in reading users", err);
    logger.error("Error, Problem in reading all users")   // εμφάνιση πληροφοριίας που έχει γίνει log
    res.status(400).json({status:false, data: err});      // Στείλε πίσω ένα JSON με το status = false και στα data το περιεχόμενο του μηνύματος
  }
}


// Μια διαδικασία για να επιστρέφει ένα συγκεκριμένο user
exports.findOne = async(req, res) => {
  console.log("Find user with specific username");
  let username = req.params.username;     // εκχώρηση στη μεταβλητή μας της path parameter απο μια κλήση get

  try {
    // const result = await User.findOne({username: username});   // εκχωρούμε τα αποτελέσματα του find σε μία result, το φίλτρο της αναζήτησής μας είναι {username: username}
    const result = await userService.findOne(username);           // αντι να τρέχει απο το Controller οπως η πάνω τωρα τρέχει απο το Service, εδω μπορώ να του βάλω password:0 για να μην επιστρέφει το password
    if (result) {                                                 // αν έχω ένα αποτέλεσμα κάνε τα παρακάτω
      res.status(200).json({status:true, data: result});          // μας επιστρέφει ένα JSON με status και data ακόμα και αν δεν υπάρχει ο χρήστης το result θα είναι 0
    } else {                                                      // αν δεν έχω αποτέλεσμα ή έχω κένο result
      res.status(404).json({status: false, data: "User not exist"})   
    }
  } catch (err) {
    console.log("Problem in findng user", err)
    res.status(400).json({status: false, data: err});             // αν υπάρξει πρόβλημα επιστρέφει αυτό το JSON, πχ αν πέσει η βάση
  }
}


// Δημιουργία χρήστη
exports.create = async(req, res) => {
  console.log("Create User");
  let data = req.body;                        // διαβάζουμε τα data που έρχονται με post
  const SaltOrRounds = 10;                    // θα πάρει το password που δίνουμε ως text κσι θσ κρυπτογραφηθεί 10 φορές 
  const hashedPassword = await bcrypt.hash(data.password, SaltOrRounds)   // το κρυπτογραφημένο password θα τρέξει μία διαδικαασία απο το bcrypt, το passwοrd που θέλουμε να πληκτρολογήσουμε, κάθε φορά που δημιουργώ ένα 
  
  const newUser = new User({                  // Είναι απο το σχήμα που έχουμε υλοποιήσει με το mongoose
    username: data.username,                  // παίρνει τα data απο το username
    // password: data.password,               // παίρνει τα data απο το password
    password: hashedPassword,                 // παίρνει το κρυπτογραφημένο password
    name: data.name,                          // παίρνει τα data απο το name
    surname: data.surname,                    // παίρνει τα data απο το surname
    email: data.email,                        // παίρνει τα data απο το email
    address: {
      area: data.address.area,                // παίρνει τα data απο το address.area
      road: data.address.road                 // παίρνει τα data απο το address.read
    } 
  });

  try{
    const result = await newUser.save();      // αποθηκεύουμε στην μεταβλητή result με newUser.save()
    res.status(200).json({status: true, data: result});   // αν όλα πάνε καλά μας στέλνει ένα JSON με status και data
  } catch (err) {
    console.log("Problem in creating user", err);
    res.status(400).json({status: false, data: err});     // αν δεν πάνε καλά τότε μας στέλνει πίσω ένα JSON
  }
}

// Διαδικασία για update (τύπου patch)
exports.update = async(req, res) => {   // για να μπορέσει κάποιο άλλο αρχείο να χρησιμοποιήσει την διδικασία update την κάνω export για να την βρίσκουν, μπορεί να γίνει και με function update αλλα θα πρέπει να βάλω στο τέλος module.exports = {update}
  const username = req.body.username;   // το update είναι τύπου patch

  console.log("Update user with username", username);

  const updateUser = {                // Φτιάχνω το JSON που θέλω να αποθηκεύσω, το username δεν πρέπει να αλλάξει είναι μοναδικό, μόνο διαγραφή γίνεται
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    address: {
      area: req.body.address.area,
      road: req.body.address.road
    }
  };

  try {
    const result = await User.findOneAndUpdate({username: username}, updateUser, {new:true});   // βρίσκει με το κριτήριο αναζήτησης username και το {new:true} μπαίνει για να μου επιστρέψει το document με τις αλλαγές
    res.status(200).json({status:true, data:result});     // επιστρέφει 200 και ένα JSON 
  } catch (err) {
    console.log("Problem in updating user", err);
    res.status(400).json({status:false, data: err});      // αν δεν πάει καλά επιστρέφει 400 και ένα JSON με status και το data το μήνυμα λάθους
  }
}

// Διαγραφή χρήστη με username
exports.deleteByUsername = async(req, res) => {
    const username = req.params.username                // επειδή είναι parameter path
    console.log("Delete user with username", username);

    try {
      const result = await User.findOneAndDelete({username:username});    // κάνω αναζήτηση με το username
      res.status(200).json({status:true, data: result});
    } catch (err) {
      console.log("Problem in deleting user", err);
      res.status(400).json({status: false, data: err});
    }
}
// http://localhost:3000/api/users/test                 // το deleteByUsername γίνεται με αυτή την κλήση

exports.deleteByEmail = async(req, res) => {        
  const username = req.params.username
  const email = req.params.email;
  console.log("Delete user by email", email);

  try {
    const result = await User.findOneAndDelete({email:email});            // κάνω αναζήτηση με το email
    res.status(200).json({status:true, data: result});
  } catch (err) {
    console.log("Problem in deleting by email", err);
    res.status(400).json({status: false, data: err});
  }
} 
// http://localhost:3000/api/users/test/email/lakis@aueb.gr               // το deleteByEmail γίνεται με αυτή την κλήση
