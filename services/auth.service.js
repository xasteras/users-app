// θα δημιουργήσουμε μια function που θα μου δημιουργεί το JWT token και να μου επιστρέψει το αποτέλεσμα της function πίσω

const jwt = require('jsonwebtoken');      // εκχωρούμε την βιβλιοθήκη jsonwebtoken
const { OAuth2Client } = require('google-auth-library')   // εκχωρούμε την βιβλιοθήκη που βρίσκεται στην google-auth-client


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

async function googleAuth(code) {             // παίρνει ένα input το code
  console.log("Google login", code);          // ένα console log για να ξέρω οτι έχω φτάσει μέχρι εδώ
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;             // μια μεταβλητή CLIENT_ID που εκχωρώ αυτό που έχω στο .enw GOOGLE_CLIENT_ID
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;     // μια μεταβλητή CLIENT_SECRET που εκχωρώ αυτό που έχω στο .enw GOOGLE_CLIENT_SECRET
  const REDIRECT_URI = process.env.REDIRECT_URI;              // μια μεταβλητή REDIRECT_URI που εκχωρώ αυτό που έχω στο .enw REDIRECT_URI

  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);    // μια μεταβλητή oauth2Client εκχωρώ αυτό που έχω βάλει απο την βιβλιοθήκη OAuth2Client = google-auth-library και αρχικοποιείται περνώντας το CLIENT_ID, CLIENT_SECRET, REDIRECT_URI

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)      // χρησιμοποιώ την μεταβλητή tokens απο την oauth library και του λέμε απο το oauth2Client θα τρέξεις μια διαδικασία getToken και του περνάω το code απο την googleAuth
    console.log("Step 1", tokens)                             // εμφάνισει token στο console log
    oauth2Client.setCredentials(tokens)                       // για το token που μου έδωσε να το πιστοποιήσει η google με setCredentials 

    // Επαλήθευση του ID token για να πάρουμε πληροφορίες του χρήστη
    const ticket = await oauth2Client.verifyIdToken({         
      idToken: tokens.id_token,                               // του στέλνουμε μια μεταβλητή idToken που του βάζουμε το id_token
      audience: CLIENT_ID                                     // του στέλνουμε μια μεταβλητή audience που του βάζουμε το CLIENT_ID
    });

    console.log("Step 2")

    const userInfo = await ticket.getPayload();               // απο το ticket που έχουμε δημιουργήσει να μας δώσει το payload απο το token
    console.log("Google User", userInfo);
    return {user: userInfo, tokens}                           // επιστροφή του χρήστη και των tokens
  } catch (error) {
    console.log("Error in google authentication", error);
    return { error: "Failed to authenticate with google"}
  }
}

// Εξαγωγή όλων των συναρτήσεων για χρήση σε άλλα modules 
module.exports = { generateAccessToken, verifyAccessToken, googleAuth }