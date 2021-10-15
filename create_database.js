var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("centrale_life");
  dbo.createCollection("rooms", function(err, res) {
    if (err) throw err;
    console.log("Collection centrale_life created!");
    db.close();
  });
});