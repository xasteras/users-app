// Η βιβλιοθήκη swaggerUI είναι υπεύθυνη για την εμφάνιση όλων των endpoints που έχω

const m2s = require('mongoose-to-swagger');     // εκχωρώ την βιβλιοθήκη mongoose-to-swagger που παίρνει το user.model.js που έχουμε δημιουργήσει με το mongoose το μετατρέπει σε JSON και μου επιτρέπει να το εμφανίσω στη σελίδα swagger που έχω έτσι ώστε πέρα απο τις κλήσεις να ξέρουμε και τα μοντέλα που έχουμε
const User = require('./models/user.model');    // καλώ το μοντέλο User που έχω δημιουργήσει

exports.options = {           // φτίαχνουμε το .options
  "components": {             // έχουμε ένα πεδίο components με τα σχήματα που έχουμε
    "schemas": {              // key schemas
      User: m2s(User)         // ένα schema User και χρησιμοποιόντας την μεταβλητή m2s κάλεσε το μοντέλο schema (User)
    },
    "securitySchemes": {      // ένα ακόμα attribute securitySchemes
      "bearerAuth" : {        // το securitySchemes που θα χρησιμοποιήσω είναι το bearerAuth
        "type" : "http",      // τύπο που έχω, http
        "scheme" : "bearer",  // τύπος scheme που έχω, bearer
        "bearerFormat" : "JWT"          // fornat είναι JWT
      }
    }
  },                          // κλείνει το component
  "security" :[               // θέλουμε να εμφανίσει το security στο swagger
    {"bearerAuth" :[]}        // θα είναι bearerAuth
  ],
  "openapi":"3.1.0",          // χρησιμοποιεί την version 3.1.0 του openapi
  "info":{                    // πληροφορίες της εφαρμογής που έχουμε
    "version": "1.0.0",       // έκδοση της εφαρμογής μας
    "title": "Users and Products CRUD API",   // τίτλος της εφαρμογής μας
    "description":"An application for creating users and choosing product",   // περιγραφή της εφαρμογής μας
    "contact": {              // ένα sub-Document
      "name": "API Support",  // με ποιούς να επικοινωνήσει
      "url": "https://aueb.gr",   //  σελίδα της εφαρμογής μας
      "email":"support@example.com"   //  mail για την εφαρμογής μας
    }
  },
  "servers": [                // τους servers που μπορούμε να χρησιμοποιήσουμε και να κάνουμε τις δοκιμές μας, ένα array
    {
      url:"http://localhost:3000",        // document url, τοπικός server
      description:"Local Server"          // περιγραφή του server
    },
    {
      url:"http://www.backend.aueb.gr",   // document url, παραγωγικού server
      description: "Testing server"       // περιγραφή του server
    }
  ],
  "tags": [                 // για να ομοδοποιήσουμε τα tags
    {
      "name": "Users",      // tag που θέλω
      "description": "Endpoints for User"   // περιγραφή του tag
    },
    {
      "name": "Users and Products",         // tag που θέλω
      "description": "Endpoints for users and their products"   // περιγραφή του tag
    },
    {
      "name":"Auth",                        // tag που θέλω
      "description": "Endpoints for Authentication"             // περιγραφή του tag
    }
  ],
  "servers": [              // τους servers που έχουμε και μπορούμε να κάνουμε τις δοκιμές μας
    {
      url:"http://localhost:3000",    // τοπικός server
      description:"Local Server"      // περιγραφή server
    },
    {
      url:"http://www.backend.aueb.gr", // παραγωγικό backend server
      description: "Testing server"     // περιγραφή server
    }
  ],
  "tags": [                 // 
    {
      "name": "Users",
      "description": "Endpoints for User"
    },
    {
      "name": "Users and Products",
      "description": "Endpoints for users and their products"
    },
    {
      "name":"Auth",
      "description": "Endpoints for Authentication"
    }
  ],
  "paths": {                  // για την ομαδοποιήση των endpoints
    "/api/users": {           // για την 1η ομάδα /api/users, χωρίς παράμετρο
      "get": {                // περιγραφή για την κλήση get
        "tags":["Users"],     // σε ποιό απο τα τρία tags ανήκει
        "description":"Returns a list of all users",        // περιγραφή
        "responses":{         // τι περιμένω να μου επιστρέψει αυτή η κλήση (get)
          "200":{             // 200
            "description": "List of all users",             // περιγραφή της επιστροφής
            "content": {      // για την δήλωση του τύπου της επιστροφής
              "application/json": {                         // επιστρέφει ένα JSON
                "schema": {   // το schema του JSON που θα επιστρέψει
                  "type":"array",                           // θα είναι array
                  "items": {  // τα περιεχόμενα του array
                    "$ref":"#/components/schemas/User"      // θα έχουν την μορφή username, password, name, surname, email, address, ..., updateAt, ότι έχει το schema του User. Με το # αναφέρομαι σε αυτό που ακολουθεί δηλαδή στα components
                  }
                }
              }
            }
          }
        }
      },
      "post":{                // για την κλήση post της /api/users
        "tags": ["Users"],    // το tag στο οποίο ανήκει, Users
        "description": "Data of users that we want to create",
        "requestBody":{       // στο body κάτι θα έρθει
          "description": "JSON with user data",
          "content": {        // τα data που θέλουμε να στείλουμε
            "application/json": {         // τύπος που θα στείλουμε, JSON
              "schema":{      // περιγραφή του schema αυτών που θα στείλουμε
                "type":"object",          // ο τύπος είναι ένα object 
                "properties":{            // με τις παρακάτω ιδιότητες, πεδία
                  "username": {"type":"string"},    // username, τύπος string
                  "password": {"type":"string"},    // password, τύπος string
                  "name": {"type": "string"},       // name, τύπος string
                  "surname": {"type":"string"},     // surname, τύπος string
                  "email": {"type":"string"},       // email, τύπος string
                  "address": {                      // ένα object με όνομα address
                    "type": "object",               // ο τύπος είναι object
                    "properties": {                 // με τις παρακάτω ιδιότητες, πεδία
                      "area": {"type":"string"},    // area , τύπος string
                      "road": {"type":"string"}     // road, τύπος string
                    }
                  },
                  "phone": {              // ένα άλλο πεδίο με όνομα phone
                    "type":"array",       // τύπου array, πίνακα
                    "items": {            // με items
                      "type": "object",   // τα items είναι τύπου object
                      "properties":{      // και οι ιδιότητες, πεδία
                        "type": {"type": "string"},   // type, τύπου string
                        "number": {"type": "number"}  // number, τύπου string
                      }
                    }
                  }
                },
                "required":["username", "password", "name", "surname", "email"]   // αυτά είναι τα υποχρεωτικά πεδία που πρέπει να πληκτρλογήσει ο χρήστης
              }
            }
          }
        },      // εδώ τελειώνει το request body
        "responses": {    // τα response που έχω
          "200": {
            "description": "JSON of new user"
          }
        }
      }      
    },
    "/api/users/{username}":{   // ένα καινούργιο path για την 2η ομάδα
      "get": {
        "tags": ["Users"],      // σε ποιό tag ανήκει αυτή η κλήση
        "parameters": [         // σε ποιά παράμετρο ανήκει αυτή η κλήση (path parameter)
          {                     // δηλώνουμε ένα document
            "name": "username", // οτι έχουμε δηλώσει παραπάνω, /{username}
            "in":"path",        // η παράμετρος username βρίσκεται στο path, είναι path parameter
            "required":true,    // είναι υποχρεωτική
            "description": "Username of user that we want to find",   // μια περιγραφή της παραμέτρου
            "type": "string"    // τι τύπου είναι, string
          }                     // δεν έχουμε άλλη παράμετρο και βγαίνουμε απο το array με τις path parameters
        ],
        "description": "Returns users details for specific username", // περιγραφή της get κλήσης που έχω
        "responses": {          // γράφουμε και τα responses
          "200": {              // στο 200
            "description": "User details",    
            "content":{         // το περιεχόμενο αυτού που επιστρέφει
              "application/json":{                    // ένα application/JSON
                "schema": {     // και το schema
                  "$ref":"#/components/schemas/User"  // απο το components/schemas/User
                }
              }
            }            
          }
        }
      },
      "patch":{                 // για την κλήση patch της /api/users/{username}
        "tags": ["Users"],      // ανήκει στο tag με όνομα Users
        "description": "Update user",
        "parameters":[          // είναι παράμετροι που περνάμε, parameters path αλλα και body που θα υλοποιήσουμε παρακάτω. Βάζουμε δηλαδή το όνομα του User σαν path parameter και το στοιχεία που θέλουμε να αλλάξουμε στο body του JSON
          {
            "name":"username",  // οτι έχουμε δηλώσει παραπάνω, {username}
            "in":"path",        // η παράμετρος username βρίσκεται στο path, είναι path parameter 
            "required":true,    // είναι υποχρεωτική
            "description": "Username of user that can update",
            "type":"string"     // τι τύπου είναι, string
          }
        ],                      // εδώ τελειώνει η path parameter και έχουμε το requestBody
        "requestBody":{         // το body για τα στοιχεία που θέλουμε να κάνουμε update
          "description":"Data of user to update",
          "content": {          // τα περιεχόμενα του data
            "application/json":{      // αυτό που στέλνω έιναι application/json
              "schema": {       // το σχήμα του JSON
                "type":"object",      // ο τύπος έιναι object που θα στείλουμε
                "properties":{        // οι ιδιότητες, πεδία
                  "username": {"type":"string"},      // username, τύπος string
                  "name": {"type":"string"},          // name, τύπος string
                  "surname": {"type":"string"},       // surname, τύπος string
                  "email":{"type": "string"},         // email, τύπος string
                  "address": {                        // ένα object με όνομα address 
                    "type":"object",                  // τύπος object
                    "properties":{                    // ιδιότητες που έχει
                      "area": {"type": "string"},     // area, τύπος string
                      "road": {"type": "string"}      // road, τύπος string
                    }
                  }
                },              // εδώ τελειώνουν τα properties
                "required": ["email"]                 // υποχρεωτικό πεδίο το email
              }
            }
          }
        },                    // εδώ τελειώνει το request
        "responses":{
          "200":{
            "descripiton": "Update user"
          }
        }
      },                      // εδω τελειώνει η patch
      "delete": {             // κλήση delete
        "tags": ["Users"],    // το tag στο οποίο ανήκει, Users
        "description": "Delete user from DB",
        "parameters": [       // παίρνει μια path parameter
          {
            "name": "username",   // το όνομα της μεταβλητής μας
            "in":"path",          // που βρίσκεται η μεταβλητή μαας
            "description": "User to delete",
            "type": "string",     // τύπος της μεταβλητής μας
            "required": true      // είναι υποχρεωτική
          }
        ],
        "responses": {            // τι επιστρέφει
          "200": {
            "description":"Delete a user"
          }
        }
      }
    },
    "/api/auth/login": {      // δημιουργούμε μια άλλη κατηγορία κλήσεων
      "post": {               // τύπος κλήσης, post
        "tags": ["Auth"],     // tags που ανήκει αυτή η κλήση
        "description": "Login User",      // περιγραφή 
        "requestBody": {      // κάτι θα έρθει στο boy
          "description": "User send username and password and for response we have jwt token",
          "content": {        // το περιεχόμενο αυτού που επιστρέφει, αυτό που θα έρθει
            "application/json":{    // ένα JSON 
              "schema": {     // το σχήμα του JSON  
                "type": "object",   // είναι ένα object
                "properties": {     // περιέχει τα παρακάτω πεδία
                  "username": { "type": "string" },     // usename τύπου string
                  "password": { "type": "string" }      // password τύπου string
                },
                "required": ["username", "password"]    // και τα δύο πεδία είναι υποχρεωτικά
              }
            }
          }
        },
        "responses": {        // τι responses θα έχω
          "200": {      
            "description": "Token returned"
          }
        }
      }
    },
    "/api/user-product/{username}":{      // δημιουργούμε μια άλλη κατηγορία κλήσεων
      "get": {                // τύπος κλήσης, get
        "tags": ["Users and Products"],   // tags που ανήκουν αυτή η κλήση
        "parameters": [       // είναι path parameter
          {                   // το document και τι περιέχει 
            "name":"username",  // το όνομα της μεταβλητής μου
            "in":"path",        // που είναι η μεταβλητή μου
            "required": true,   // υποχρεωτικό πεδίο
            "description": "Find user and products",
            "type": "string"    // τύπος μεταβλητής
          }
        ],
        "responses":{         // τι επιστρέφει
          "200": {
            "description": "User anδ Products",
            "schema":{        // επιστρέφει και ένα schema
              "$ref": "#/components/schemas/User"     // που είναι
            }
          }
        }
      }
    }
  }
}