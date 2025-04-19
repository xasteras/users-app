const winston = require('winston');     // στην μεταβλητή winston εκχωρώ όλες τις μεθόδους και ιδιότητες που έχει η βιβλιοθήκη winston

// 1o παράδειγμα
// const logger = winston.createLogger(    // δημιουργώ μία μεταβλητή logger και με την .createLogger που μου δίνει η βιβλιοθήκη της winston
//   {                                     // μέσα στο object της logger δημιουργώ το logger 
//     format: winston.format.json(),      // στο αρχείο που θα δημιουργήσει θα αποθηκεύει JSON
//     transports: [                       // είναι ένα array και δηλώνω που θέλω να διοχετέυω αυτό το log, πχ σε text αρχειο, στην βάση μου, στην console log
//       new winston.transports.Console()  // εμφάνιση στην Console (console.log)
//     ]
//   }
// )

// Second Example
// const { format, createLogger, transports } = require('winston') // Εισάγω τις βασικές συναρτήσεις της winston
// const { combine, timestamp, label, printf } = format             // Εξάγω τις συναρτήσεις format για χρήση παρακάτω

// const CATEGORY  = "Products app logs" // Δημιουργώ μια προσαρμοσμένη ετικέτα (label) για να φαίνεται η προέλευση του log

// // Δημιουργώ δικό μου custom format – πώς θα εμφανίζονται τα logs στην κονσόλα
// const customFormat = printf(({level, message, label, timestamp})=>{
//     return `${timestamp} [${label}: ${level}, ${message}]`; // π.χ. "2025-04-12 [Products app logs: info, Κάποιο μήνυμα]"
// })

//  // Δημιουργώ τον logger με το custom format
// const logger = createLogger({
//   // level: "warn",                      // (αν ενεργοποιηθεί) εμφανίζει μόνο warn και error logs
//   format: combine(                      // Συνδυάζω τα formats για εμφάνιση
//     label({label: CATEGORY}),           // προσθέτω label
//     timestamp(),                        // προσθέτω χρονική σήμανση
//     customFormat                        // εφαρμόζω το custom print format
//   ),
//   transports: [new transports.Console()] // εμφάνιση των logs στην κονσόλα
// })

// // For jest tests
// // require('dotenv').config(); // Αν χρειάζεται να φορτωθεί .env αρχείο για περιβάλλον (test ή dev)

// Third Example
require('winston-daily-rotate-file');   // Εισάγω υποστήριξη για περιστροφή αρχείων ανά ημέρα
require('winston-mongodb');             // Εισάγω υποστήριξη για αποθήκευση logs σε MongoDB

const { format, createLogger, transports } = require('winston'); // Εξάγω βασικές συναρτήσεις της winston
const { combine, timestamp, label, printf, prettyPrint } = format; // Εξάγω εργαλεία μορφοποίησης των logs

const CATEGORY  = "Products app logs"; // Δημιουργώ label για κατηγοριοποίηση των logs

// Ορίζω έναν περιστρεφόμενο μεταφορέα log που δημιουργεί νέο αρχείο κάθε μέρα
const fileRotateTransport = new transports.DailyRotateFile({
  filename: "./logs/rotate-%DATE%.log", // όνομα αρχείου με ημερομηνία
  datePattern: "DD-MM-YYYY",            // μορφή ημερομηνίας
  maxFiles: "7d",                        // διατηρεί logs για 7 ημέρες
  level: "error"                         // καταγράφει μόνο error logs
})

// Δημιουργία logger με πολλαπλά επίπεδα μεταφοράς (console, αρχεία, MongoDB)
const logger = createLogger({
  format: combine(                                        // Ορίζω το format που θέλω
    label({label: "MY LABEL FOR PRODUCTS APP"}),          // Προσαρμοσμένο label
    timestamp({format:"DD-MM-YYYY HH:mm:sss"}),           // Timestamp με μορφοποίηση
    format.json()                                         // Αποθήκευση σε JSON (ιδανικό για αρχεία και βάσεις)
    // prettyPrint()                                     // Αν ενεργοποιηθεί, βελτιώνει την εμφάνιση των JSON logs
  ),
  transports: [
    new transports.Console(),                            // Εκτύπωση logs στην κονσόλα

    fileRotateTransport,                                 // Περιστροφή log αρχείων ανά ημέρα (μόνο errors)

    new transports.File({                                // Καταγραφή όλων των logs σε ένα κοινό αρχείο
      filename:"logs/example.log"
    }),

    new transports.File({                                // Καταγραφή μόνο WARN logs
      level: "warn",
      filename: 'logs/warn.log' 
    }),

    new transports.File({                                // Καταγραφή μόνο INFO logs
      level: "info",
      filename: 'logs/info.log'
    }),

    new transports.MongoDB({                             // Αποθήκευση logs επιπέδου WARN+ στη MongoDB
      level: "warn",                                     // Καταγραφή από warn και πάνω
      db: process.env.MONGODB_URI,                       // Λαμβάνει το URI από το .env αρχείο
      collection: 'server_logs',                         // Συλλογή στη βάση για τα logs
      format: format.combine(
          format.timestamp(),                            // Προσθήκη timestamp
          format.json()                                  // Μορφή JSON
      )
    })
  ]
})


module.exports = logger;                // για να μπορώ να το χρησιμοποιήσω σε άλλες υπηρεσίες