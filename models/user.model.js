const mongoose = require("mongoose");   // Σε μία μεταβλητή που την ονομάζουμε mongoose Θα καλέσω όλες τις μεθόδους και τις ιδιότητες που έχει η βιβλιοθήκη mongoose

const Schema = mongoose.Schema;         // Δημιουργια μεταβλητής Schema που είναι ενα mongoose.Schema

let addressSchema = new Schema({        // Δηλώνω το addressSchema που δημιούργησα παρακάτω
  area: { type: String },               // Ορίζουμε τους τύπους  
  road: { type:String } 
}, {_id: false});                       // επειδή το address είναι καινούργιο Schema (document) δεν θέλουμε να βάλει αυτόματα id

let phoneSchema = new Schema({
  type: {type: String},
  number: {type: String}
}, {_id: false});

let productsSchema = new Schema({
  product: {type: String},
  cost: {type: Number},
  quantity: {type: Number, required: true},
  date: {type: Date, default: Date.now}   // Την ώρα που θα αποθηκευτεί θα πάρει την ημερομηνία και την ώρα που αποθηκέυεται στη Βαση
})

// Μέσα σε μορφή JSON ορίζω το σχήμα που θέλω για την μεταβλητή username, password, name, surname, email, address
let userSchema = new Schema({
  username: {
    type: String,                     // τι τύπος είναι
    required: [true, "Username is required field"],   // είναι υποχρεωτικό πεδίο και αν δεν συμπληρωθεί εμφανίζει μήνυμα "Username is required field"
    max: 20,                          // μέγιστοι χαρακτήρες
    unique: true,                     // είναι μοναδικό
    trim: true,                       // χωρίς κενά
    lowercase: true                   // όλα πεζά (μικρά)
  },
  password: { 
    type: String, 
    required: [true, 'Password is required field'],
    max:20
  },
  name: {
    type: String,
    required: [true, 'Name is required field'],
    max: 20
  },
  surname: {
    type: String,
    required: [ true, 'Surname is required field'],
    max: 20
  },
  email: {
    type: String,
    required: [ true, 'Email is required field'],
    max: 20,
    unique:true,
    trim: true,
    lowercase: true
  },
  address: addressSchema,         // To address είναι ένα πεδίο που το ονομάζω addressSchema
  phone: { type: [phoneSchema], null: true},    // Είναι τύπου array απο phoneSchema και μπορεί να είναι και κενό null: true(να μην έχει τηλέφωνο)
  products: { type : [productsSchema], null: true},
  roles: {type:[String], null: true}
},
{
  // To Schema που δημιουργήσαμε είναι για την collection: 'users'
  collection: 'users',
  timestamps: true            // createdAt, updateAt, v : version, τα βάζει αυτόματα η mongoose με την timestamps: true  
});

module.exports = mongoose.model("User", userSchema)   // Όταν θα καλέσω από άλλα αρχεία που έχω για παράδειγμα Controller Θα θέλω να κάνω κάτι για το user σχήμα δεν θα χρησιμοποιώ το userSchema αλλα την λέξη User