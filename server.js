const mongoose = require("mongoose");
const app = require('./app');     // import απο app.js
const port = 3000;

// Σύνδεση με την Βάση Δεδομένων

// mongoose.connect("mongodb+srv://cfUser:yBU8b04ZiKTIPrie@cluster0.tpy9d.mongodb.net/codingfactory?retryWrites=true&w=majority")  // Στα "" μπαίνει το connection string, επειδή όμως δεν πρέπει να ανεβαίνει στο git το link του server μου για λόγους ασφαλείας φτίαχνουμε ένα αρχείο .env Όπου βάζουμε μέσα το σύνδεσμο για τον server και το αφαιρούμε αυτό απο το gitignore (.env) από εκεί και μετά κάνουμε με το παρακάτω


// Θέλουμε πρώτα να γίνει η σύνδεση με την MongoDB και μετά να εμφανίζει μήνυμα Server is up
mongoose.connect(process.env.MONGODB_URI)   // σύνδεση στον server
  .then(              // Είναι ένα promise, τρέχω κάτι και περιμένω να μου επιστρέψει κάτι. Όλες οι promise διαδικασίες έχουν το .then
    () => {
      console.log("Connection to MongoDB established");

      app.listen(port, ()=>{                // αν πάνε όλα καλά μετά το promise εκκινεί τον σερβερ
        console.log("Server is up")
      })
    },
    err => { console.log('Failed to connect to MongoDB', err); }    // διαφορρετικά εμφανίζει μήνυμα λάθους
  )

