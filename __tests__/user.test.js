// Εισάγουμε την mongoose για σύνδεση με MongoDB
const mongoose = require("mongoose");

// Βιβλιοθήκη για testing HTTP αιτημάτων στο Express app
const request = require("supertest");

// Υπηρεσία που παρέχει authentication (π.χ. δημιουργία JWT)
const authService = require('../services/auth.service');

// Υπηρεσία για λειτουργίες CRUD χρηστών
const userService = require('../services/user.services');

// Το Express app μας
const app = require('../app');

// Πριν από κάθε τεστ, συνδέσου με τη βάση MongoDB
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI) // Παίρνουμε το URI από το .env
    .then(
      () => { console.log("Connection to MongoDB established for Jest") }, // Αν πετύχει
      err => { console.log("Failed to connect to MongoDB for Jest", err) } // Αν αποτύχει
    );
});

// Μετά από κάθε τεστ, κλείνουμε τη σύνδεση με τη MongoDB
afterEach(async () => {
  await mongoose.connection.close();
});

// Κύριο block με tests για το endpoint /api/users
describe("Requests for /api/users", () => {

  let token;                                       // Το JWT token που απαιτείται για εξουσιοδότηση

  // Πριν εκτελεστούν όλα τα tests σε αυτό το block
  beforeAll(() => {                                // Φτιάχνουμε ένα object
    const user = {
      username: "admin",                           // Χρήστης τύπου admin
      email: "admin@aueb.gr",
      roles: ["EDITOR", "READER", "ADMIN"]         // Ένα array με τους ρόλους
    };
    token = authService.generateAccessToken(user); // Δημιουργούμε token με βάση τα στοιχεία του χρήστη, επιστρέφει ένα JWT
  });

  // Test για το GET: Επιστροφή όλων των χρηστών
  it('GET Returns all users', async () => {
    const res = await request(app)
      .get('/api/users')                        // Endpoint
      .set('Authorization', `Bearer ${token}`); // Δημιουργούμε ένα token και το βάζουμε το token στο header

    expect(res.statusCode).toBe(200);           // Πρέπει να είναι επιτυχία
    expect(res.body.status).toBeTruthy();       // Το status στο response πρέπει να είναι true
    expect(res.body.data.length).toBeGreaterThan(0); // Περιμένουμε τουλάχιστον έναν χρήστη
  }, 50000);                                    // Δίνουμε περισσότερο χρόνο στο test

  // Test για POST: Δημιουργία νέου χρήστη
  it("POST Creates a user", async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'test5',
        password: '12345',
        name: 'test5 name',
        surname: 'test5 surname',
        email: 'test5@aueb.gr',
        address: {
          area: 'area1',
          road: 'road5'
        }
      });

    expect(res.statusCode).toBe(200); // Περιμένουμε επιτυχία
    expect(res.body.status).toBeTruthy();
  }, 50000);

  // Test για απόρριψη χρήστη με υπάρχον username
  it("POST Creates a user with same username", async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'test5', // Ήδη υπάρχει
        password: '12345',
        name: 'new name',
        surname: 'new surname',
        email: 'new@aueb.gr', // Νέο email
        address: {
          area: 'xxxx',
          road: 'yyyy'
        }
      });

    expect(res.statusCode).toBe(400); // Περιμένουμε σφάλμα
    expect(res.body.status).not.toBeTruthy();
  });

  // Test για αποτυχία λόγω ήδη καταχωρημένου email
  it("POST Creates a user with same email", async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'test6', // Νέο username
        password: '12345',
        name: 'name test6',
        surname: 'surname test6',
        email: 'test5@aueb.gr', // Ήδη χρησιμοποιείται
        address: {
          area: 'area23',
          road: 'road23'
        }
      });

    expect(res.statusCode).toBe(400); // Περιμένουμε αποτυχία
    expect(res.body.status).not.toBeTruthy();
  });

  // Test για αποτυχία με κενά υποχρεωτικά πεδία
  it("POST Creates a user with empty surname, name, password", async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'test6',
        password: '', // Κενό
        name: '',     // Κενό
        surname: '',  // Κενό
        email: 'test6@aueb.gr',
        address: {
          area: 'area23',
          road: 'road23'
        }
      });

    expect(res.statusCode).toBe(400); // Περιμένουμε σφάλμα από validaton
    expect(res.body.status).not.toBeTruthy();
  });
});

// Νέο block για endpoints που χρησιμοποιούν συγκεκριμένο χρήστη
describe("Requests for /api/users/:username", () => {
  let token;

  // Πριν όλα τα tests, δημιουργούμε token
  beforeAll(() => {
    const user = {
      username: "lakis",
      email: "lalakis@aueb.gr",
      roles: ["EDITOR", "READER", "ADMIN"]
    };
    token = authService.generateAccessToken(user); // Δημιουργία token
  });

  // Test για GET με συγκεκριμένο username
  it("GET returns specific user", async () => {
    const result = await userService.findLastInsertedUser(); // Βρίσκει τον πιο πρόσφατο χρήστη

    const res = await request(app)
      .get('/api/users/' + result.username)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data.username).toBe(result.username);
    expect(res.body.data.email).toBe(result.email);
  });

  // Test για PATCH (ενημέρωση χρήστη)
  it("PATCH update a user", async () => {
    const result = await userService.findLastInsertedUser(); // Βρίσκουμε τον τελευταίο χρήστη

    const res = await request(app)
      .patch('/api/users/' + result.username)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: result.username,
        name: "new updated name",
        surname: "new updated surname",
        email: "new@aueb.gr",
        address: {
          area: "area50",
          road: result.address.road
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
  });

  // Test για διαγραφή χρήστη
  it("DELETE delete a user", async () => {
    const result = await userService.findLastInsertedUser(); // Παίρνουμε τελευταίο χρήστη

    const res = await request(app)
      .delete('/api/users/' + result.username)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
  });
});
