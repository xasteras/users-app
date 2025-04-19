// To app.js είναι ένα αρχείο που κάνει όλο το configuration της εφαρμογής ειδικά τα Middleware όπως τα .use, απο εδώ ξεκινάει η εφαρμογή  

const express = require("express");
const app = express()
const cors = require("cors");

app.use(express.json());    // απο τους headers που έρχονται διάβασε τo body που έχουν κάποιο JSON μέσα, ενέργεις που γίνονται πρίν φτάσουν στους Controllers, Middleware, σαν τα φίλτρα της Jakarta

app.use(express.urlencoded({extended:false}));

const swaggerUi = require('swagger-ui-express');  // καλώ την βιβλιοθήκη swagger
const swaggerDocument = require('./swagger');     // εκχωρώ το αρχείο swagger.js 

const user = require('./routes/user.routes');   // όλες οι κλήσεις που αφορούν τους user,την Collection user βρίσκονται σε αυτό το αρχείο
const userProduct = require('./routes/user.products.routes')  // όλες οι κλήσεις που αφορούν την Collection userProduct βρίσκονται σε αυτό το αρχείο
const auth = require('./routes/auth.routes');   // όλες οι κλήσεις που αφορούν την Collection auth βρίσκονται σε αυτό το αρχείο

app.use(cors({
  origin: ['http://localhost:8000']             // η εφαρμογή μου είναι προσβάσιμη και απο την localhost:8000
}))

app.use('/api/auth', auth);                      // αν έρθει μια κλήση που ταιριάζει στο /api/auth τότε πήγαινε να καλέσεις στη συνέχεια τις κλήσεις που βρίσκονται στο αρχείο auth.routes που τις έχουμε εκχωρήσει στην μεταβλητή auth

app.use('/api/users', user);                    // αν έρθει μια κλήση που ταιριάζει στο /api/users τότε πήγαινε να καλέσεις στη συνέχεια τις κλήσεις που βρίσκονται στο αρχείο user.routes που τις έχουμε εκχωρήσει στην μεταβλητή user

app.use('/api/user-product', userProduct);       // αν έρθει μια κλήση που ταιριάζει στο /api/user-products τότε πήγαινε να καλέσεις στη συνέχεια τις κλήσεις που βρίσκονται στο αρχείο userproducts.routes που τις έχουμε εκχωρήσει στην μεταβλητή userProduct

app.use('/', express.static('/files'))          // όταν πάς στο root της εφαρμογής (localhost:3000) άνοιξε τον φάκελο files και το index.html(ανοίγει αυτόματα)

app.use(                                      // όταν δείς ένα endpoint /api-docs
  '/api-docs', 
  swaggerUi.serve,                            // απο την swaggerUi θα καλέσεις την μέθοδο serve που δημιουργεί ένα server για να τρέξουμε το swagger
  swaggerUi.setup(swaggerDocument.options)    // και το .setup που θα του περάσεις την παράμετρο swaggerDocument.options οπου περιέχει ένα object που περιγράφουμε όλες τις κλήσεις 
);

module.exports = app     // κάνω export όλες τις μεθόδους και τις ιδιότητες του express()