const { MongoClient,ObjectId } = require('mongodb');

// Connection URL and options
const url = 'mongodb://localhost:27017'; // MongoDB container hostname and port
const dbName = 'mydb'; // Replace with your database name

const connectToDB = async (collectionName) => {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const collection = client.db(dbName).collection(collectionName);
    return { client, collection, ObjectId };
  } catch (err) {
    throw err;
  }
};

module.exports = connectToDB;
