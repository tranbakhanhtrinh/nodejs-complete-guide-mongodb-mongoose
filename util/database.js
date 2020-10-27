const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect("mongodb+srv://tranbakhanhtrinh:airblade08@nodejs-complete-guide.fqrra.mongodb.net/nodejs-complete-guide?retryWrites=true&w=majority")
        .then(client => {
            console.log("Connected!!")
            _db = client.db();
            callback();
        })
        .catch(err => console.log(err));
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw "No database !!!"
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

