// Δημιουργία νέου Controller για τα προιόντα που θα εισάγουμε στο χρήστη και θα διαγράφουμε θα τροποποιούμε κτλ 
const User = require('../models/user.model');     // Εισάγουμε το σχήμα που έχουμε του χρήστη απο το /models/user.model

// Για όλους τους χρήστες να βρούμε τα προϊόντα τους
exports.findAll = async(req, res) => {
  console.log("Find from all users the products");

  try {
    const result = await User.find({},{username:1, products:1, _id:0});     // Να επιστρέψει τα products του συγκεκριμένου username, id:0 για να μην βάζει id
    res.status(200).json({status:true, data:result});             // To status 200 είναι στους headers το status : true και data : result στο json που επιστρέφει
  } catch (err) {
    console.log("Problem in finding from all users the products");
    res.status(400).json({status: false, data: err});
  }
}

// Βρίσκει τα προϊόντα για ένα συγκεκριμένο χρήστη
exports.findOne = async(req, res) => {
  console.log("Find products for specific user");
  const username = req.params.username;             // επειδή είναι path parameter βάζουμε .params.username

  try {
    const result = await User.findOne({username: username}, {username:1, products:1, _id:0});   // δεν θέλω να επιστρέψει όλα τα πεδία, μόνο username, products
    res.status(200).json({status:true, data: result});
  } catch (err) {
    console.log("Problem in finding user's products", err);
    res.status(400).json({status:false, data:err})
  }
}

// Push προιόντων σε χρήστη
exports.create = async(req, res) => {
  console.log("Insert products to user");
  const username = req.body.username;
  const products = req.body.products;

  try {
    const result = await User.updateOne(    // Στον υπάρχων χρήστη κάνουμε update
      {username: username},
      {
        $push: {
          products: products
        }
      }
    );
    res.status(200).json({status:true, data: result});
  } catch (err) {
    console.log("Problem in inserting product", err);
    res.status(400).json({status:false, data:err})
  }
}

// Update στο quantity ενός προιόντος με αναζήτηση id
exports.update = async(req, res) => {
  const username = req.body.username;
  const product_id = req.body.product._id;
  const product_quantity = req.body.product.quantity;

  console.log("Update product for username:", username);
  try {
    const result = await User.updateOne(
      { username:username, "products._id": product_id },  // από το πεδίο products που είναι ένα array να ψάξει όλα τα id και να βρεί αυτό που θέλω
      { $set: {
          "products.$.quantity": product_quantity         // θα πάρει την τιμή που του έχουμε στείλει εμείς. Το $ αναφέρεται στην θέση του array
      }}
    );
    res.status(200).json({status: true, data: result});
  } catch (err) {
    console.log("Problem in updating product", err);
    res.status(400).json({status: false, data: err});
  }
}

// Διαγραφή ενός προιόν με το id
exports.delete = async(req, res) => {
  // θα περάσω το username και το id πάνω στην κλήση μου
  const username = req.params.username;   
  const product_id = req.params.id;

  console.log("Delete product from user:", username);

  try {
    const result = await User.updateOne(
      { username: username },
      { 
        $pull: {
          products:{ _id: product_id }
        }
      }
    );
    res.status(200).json({status: true, data: result});
  } catch (err) {
    console.log("Problem in deleting product", err);
    res.status(400).json({status: false, data: err});
  }
}

// To συνολικό ποσό αγοράς που έχει κάνει ο χρήστης
exports.stats1 = async(req, res) => {
  console.log("For each user return total amount and num of products");

  try  {
    const result = await User.aggregate([     // το aggregate είναι ένα array απο φίλτρα
      {
        $unwind: "$products"                 // ξεδιπλώνει τα documents του products για να μπορέσω να κάνω aggregation
      },
      {
        $project: {                           // θέλουμε τα παρακάτω πεδία
          _id:1,
          username: 1,
          products: 1
        }
      },
      {
        $group: {                             // για να κάνουμε τον υπολογισμό μας χρησιμοποιούμε το φίλτρο group
          _id: {username: "$username", product: "$products.product"},   // όταν έχουμε group δηλώνουμε υποχρεωτικά ένα id, Δημιουργεί ένα πεδίο username όπου θα εκχωρήσει την τιμή του username και το όνομα του προιόντος
          totalAmount: {                      // Αφού γίνει ομαδοποίηση θα δημιουργηθεί ένα καινούργιο πεδίο με όνομα totalAmount
            $sum: { $multiply: ["$products.cost", "$products.quantity"]}  // η πράξη που γίνεται για τον υπολογισμό του totalAmount
          },
          count: {$sum:1}                     // θα γίνει και ένα πεδίο count
        }
      },
      { $sort:{"_id.username":1, "_id.product":1 } }    // μετά το group θα κάνει ένα πεδιο sort με βάση το username και στη συνέχεια με το product id
    ]);
    res.status(200).json({status:true, data:result});   // τελείωσε το aggregation και στέλνει status 200 και ένα JSON
  } catch (err) {
    console.log("Problem in stats1", err);
    res.status(400).json({status: false, data: err});
  }
}