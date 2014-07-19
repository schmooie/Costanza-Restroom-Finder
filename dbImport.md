mongoimport --db nycRestrooms --collection restrooms --jsonArray --file bathroomData2.js
db.restrooms.ensureIndex({coords: 2d})
