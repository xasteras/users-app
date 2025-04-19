const express = require('express');
const router = express.Router();        // δημιουργία μεταβλητής router που παίρνει την μέθοδο router του express

const userController = require('../controllers/user.controller');   // η μεταβλητή userController θα πάρει όλες τις μεθόδους που γίνονται export απο το user.controller
const verifyToken = require('../middlewares/auth.middleware').verifyToken   // απο τον φάκελο middleware θα πάρεις το export .verifyToken απο το αρχείο middleware
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles;  // απο τον φάκελο middleware θα πάρεις το export .verifyRoles απο το αρχείο middleware

router.get('/',verifyToken, userController.findAll);    // όταν έχω μία get κλήση στο root απο το userController κάλεσε την διαδικασία findAll
router.get('/:username', userController.findOne);       // get κλήση στο /api/users και με μία path parameter με :username (/api/users/:username)
// router.post('/',userController.create);
router.post('/', verifyToken, verifyRoles("ADMIN"), userController.create);     // άν έρθει μία post κλήση στo root θα κάνει verifyToken πρώτα, αν το ικανοποιεί θα πάει στο verifyRoles μετα και αν το ικανοποιεί (με τον ρόλο ADMIN) θα πάει στο userController.create
router.patch('/:username', verifyToken, verifyRoles("ADMIN"), userController.update);   // αν έρθει κλήση patch στο path αυτό κάνει τη διαδικασία
router.delete('/:username', verifyToken, verifyRoles("ADMIN"), userController.deleteByUsername);  // μια κλήση delete που είναι στο path parameter /api/users/ και του περνάω σαν path parameter το username και καλεί το deleteByUsername
router.delete('/:username/email/:email', verifyToken, verifyRoles("ADMIN"), userController.deleteByEmail )  // μια κλήση delete που είναι στο path parameter /api/users/ και του περνάω σαν path parameter το username/email/ και άλλη μια παράμετρο το email και καλεί το deleteByEmail

module.exports = router;