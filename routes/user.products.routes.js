// Δημιουργία αρχείου user.product.js για την διαχείριση των κλήσεων του user.product
const express = require('express');
const router = express.Router();            // δημιουργία μεταβλητής router που παίρνει την μέθοδο router του express

const userProductController = require('../controllers/user.product.controller');      // καλούμε το Controller

router.get('/', userProductController.findAll);         // όταν έχω μία get κλήση στο root (api/user) απο το userProductController κάλεσε την διαδικασία findAll
router.get('/:username', userProductController.findOne);   // όταν έχω μία get κλήση στο /api/user-product και του περνάμε το username απο το userProductController κάλεσε την διαδικασία findOne. Επειδή του περνάω το username του λέω ποιό είναι το path parameter καταλαβαίνει ότι το req.params είναι username 
router.post('/', userProductController.create);       // όταν έχω μία post κλήση στο root (api/user-product) απο το userProductController κάλεσε την διαδικασία create
router.patch('/:username', userProductController.update); // όταν έχω μία patch κλήση στο root (api/user-product/username) απο το userProductController κάλεσε την διαδικασία update    (api/user-product/user2)
router.delete('/:username/products/:id', userProductController.delete);  // όταν έχω μία delete κλήση στο root (api/user-product) απο το userProductController κάλεσε την διαδικασία delte     (api/user-product/user2/products/67ecdedfa933c324d)
router.get('/stats/stats1', userProductController.stats1);    // όταν έχω μία get κλήση στο root (api/user-product/stats/stats1) απο το userProductController κάλεσε την διαδικασία stats1

module.exports = router;