const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

function verifyToken(req, res, next) {                  // Θα κάνει έναν έλεγχο και μετά θα πάει στο next
  const authHeader = req.headers['authorization'];      // απο το request που σου έχει έρθει θα πάρεις απο τους headers το πεδίο authorization
  // console.log("REQ 1>>>>", req);
  const token = authHeader && authHeader.split(' ')[1]; // απο το authorization θα πάρω το token (θα πάρει αυτό το String, θα το διαβάσει, θα το κάνει split και θα κρατήσει το 2ο κομμάτι που έιναι το TOKEN)

  if (!token) {                                         // αν δεν υπάρχει ΤΟΚΕΝ
    return res.status(401).json({status:false, message: "Access Denied. No token provided"});   
  }

  const result = authService.verifyAccessToken(token);  // θα μας επιστρέψει το αποτέλεσμα της verifyAccessToken,  verified: true, data: payload / verified: false, data: err.message
  
  if (result.verified) {          // αν result είναι verified, verified: true, data: payload
    req.user = result.data        // στο request που έχω θα δημιουργήσει μια καινούργια μεταβλητή user και σε αυτή βάλε το result.data δηλαδή το payload, username, mail, roles
    // console.log("REQ 2>>>>", req);
    next()
  } else {                        // αν είναι false, verified: false, data: err.message
    return res.status(403).json({status: false, data: result.data})
  } 
}

function verifyRoles(allowedRole) {         // ως allowedRole είναι ότι έχουμε περάσει στο user.routes.js {"ΑDMIN"}       
  return (req, res, next) => {
    
    if((!req.user || !req.user.roles)) {    // ελέγχουμε αν υπάρχει user και αν υπάρχει ρόλος. Η πληροφορία του req.user αν υπάρχει έχει περάσει απο την verifyToken
      return res.status(403).json({status: false, data: "Forbidden: no roles found"})
    }

    const userRoles = req.user.roles        // αν υπάρχει δημιούργησε μια μεταβλητή userRoles και εκχώρησε την τιμη του req.user.roles που ξέρω οτι είναι ένα array απο το payload (roles)
    
    // const hasPermission = userRoles.some(role => allowedRole.includes(role));  // εδω έχουμε Javascript και με το some ελέγχουμε αν το array το οποίο έχουμε υπάρχει έστω κάποιος ο οποίος έχει μια τιμή, αν υπάρχει επιστρέφει true. Αν υπάρχει ο ρόλος ADMIN τότε θα επιστρέφει true
    const hasPermission = userRoles.includes(allowedRole) // το ίδιο με το απο πάνω πιο απλό χωρίς το some

    if (!hasPermission) {
      return res.status(403).json({status: false, data: "Forbidden: insufficient permissions"})
    }

    next()
  }
}

module.exports = { verifyToken, verifyRoles }