// Έλεγχος κωδικού που δίνει ο χρήστης με την ΒΔ, άν είναι το ίδιο πες μου όλα είναι ΟΚ διαφορετικά ένα μήνυμα λάθους

const bcrypt = require('bcrypt');                           // για την αποκρυπτογράφηση του password
const User = require('../models/user.model');               // θα χρειαστώ το model User
const authService = require('../services/auth.service');    // παίρνουμε την βιβλιοθήκη μας auth.service'

exports.login = async(req, res) =>{                         
  console.log("Login user", req.body);

  const username = req.body.username;                   // To JSON που θα στείλω στο body το διαβάζουμε απο εδώ
  const password = req.body.password;
  
  try {
    const result = await User.findOne({username: username},{username:1, email:1, password:1, roles:1})    // θα μου επιστρέψει μόνο αυτά τα πεδία με το 1
    console.log("User", result);
    const isMatch = await bcrypt.compare(password, result.password)   // για την αποκρυπτογράφηση του password χρησιμοποιεί η bcrypt την .compare, επιστρέφει boolean
    
    // if (result && result.username === username && result.password === password){
    if (result && result.username === username && isMatch){           // μετά την χρήση ης bcrypt το πάνω γίνεται isMatch
      const token = authService.generateAccessToken(result)           // δημιουργήσαμε το JWT
      res.status(200).json({status: true, data: token});              // τι μου επιστρέφει το JWT, στο data είναι το κρυπτογραφημένο αλφαριθμητικό ΤΟΚΕΝ
    } else {
      res.status(404).json({status: false, data: "user not logged in"});      // αν δεν υπάρχει ο χρήστης
    }
  } catch (err) {
    console.log("Problem in logging", err);
    res.status(400).json({status: false, data: err})
  }
}

// Handler function for Google Login via OAuth2
exports.googleLogin = async(req, res) => {
  const code = req.query.code;                        // Παίρνουμε το authorization code από το query string

  if (!code) {
    res.status(400).json({status: false, data: "Authorization code is missing"});     // Αν δεν υπάρχει code, επιστρέφουμε error 400
  } else {
    let user = await authService.googleAuth(code);    // Στέλνουμε το code στην υπηρεσία ελέγχου ταυτότητας για επιβεβαίωση/ανταλλαγή με token

    if (user){                                        // Αν επιστραφεί χρήστης, θεωρούμε επιτυχημένη την είσοδο
      console.log(">>>", user);                       // Εκτυπώνουμε τα στοιχεία του χρήστη στο console για debugging
      res.status(200).json({status: true, data: user});  // Επιστρέφουμε επιτυχία με τα δεδομένα του χρήστη
    } else {
      res.status(400).json({status:false, data: "Problem in Google Login"});          // Αν αποτύχει η διαδικασία, επιστρέφουμε error 400
    }
  }
}
