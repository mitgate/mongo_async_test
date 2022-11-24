var async = require('async'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var testSchema = new Schema({
  "_id": Number,
});

var Test = mongoose.model( 'Test', testSchema, 'test' );

mongoose.connect('mongodb://192.168.224.5:27017/?directConnection=true&serverSelectionTimeoutMS=2000/async');

async.series(
  [
    // Limpa a Collection Test
    function(callback) {
      Test.deleteMany({},callback)
    },

    // Insere dados
    function(callback) {
      async.each([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],function(num,callback) {
        Test.create({ "_id": num },callback);
      },callback);
    },

    // Roda teste em paralelo
    function(callback) {
      async.each([1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19],function(num,callback) {
        Test.findOneAndRemove(
          { "_id": num },
          function(err,doc) {
            if (err) callback(err);
            console.log( "Removendo: %s, %s", num, doc );
            callback();
          }
        );
      },callback);
    }
  ],
  function(err) {
    process.exit();
  }
);
