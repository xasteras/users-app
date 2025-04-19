// θα δημιουργήσουμε μια function που θα μου δημιουργεί το JWT token και να μου επιστρέψει το αποτέλεσμα της function πίσω

const jwt = require('jsonwebtoken');      // εκχωρούμε την βιβλιοθήκη jsonwebtoken

function generateAccessToken(user){       // παίρνει ως input τα στοιχεία ενός user

  console.log("Auth Service", user);      // τυπώνει τον user

  const payload = {                       // δημιουργία μεταβλητής payload που περιέχει ένα object
    username: user.username,              // παίρνει το username που θα στείλει πίσω και το βάζει στο πεδίο username
    email: user.email,                    // παίρνει το mail που θα στείλει πίσω και το βάζει στο πεδίο mail
    roles: user.roles                     // παίρνει το roles που θα στείλει πίσω και το βάζει στο πεδίο roles
  }

  const secret = process.env.TOKEN_SECRET;    // δημιουργία μεταβλητής secret και εκχωρώ το TOKEN_SECRET
  const options = { expiresIn: '1h'};         // δημιουργία μεταβλητής options που περιέχει ένα object που λέω οτι το ΤΟΚΕΝ που θα δημιουργήσω θα γίνει expire σε 1 ώρα

  return jwt.sign(payload, secret, options);  // το αποτέλεσμα αυτής της διαδικασίας είναι η δημιουργία κρυπτογραφημένου αλφαριθμητικό ΤΟΚΕΝ και περνάω την πληροφορία που έχω αποθηκεύσει στο payload(username, mail, roles), το αλφαριθμητικό που έχω στο ΤΟΚΕΝ_SECRET και οτι γίνεται expire σε μία ώρα. Αυτό θα πηγαινοέρχεται στους headers μεταξύ FrontEnd & Backend
}

function verifyAccessToken(token){            // φτιάχνουμε μια συνάρτηση verifyAccessToken, περνάμε σαν παράμετρο ένα ΤΟΚΕΝ
  const secret = process.env.TOKEN_SECRET;   
  
  try {
    const payload = jwt.verify(token, secret);  // θα μας το επιστρέψει πίσω το verify

    console.log("VerifyToken", payload);
    return { verified: true, data: payload }  // αν έχει γίνει verified το verify επιστρέφει πίσω ένα object με verified: true, data: payload
  } catch (err) {                             // διαφορετικά αν έχει παραποιηθεί το ΤΟΚΕΝ μας
    return { verified: false, data: err.message }
  }
}

module.exports = { generateAccessToken, verifyAccessToken }