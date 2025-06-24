const { MongoClient } = require('mongodb');

const mongoURI = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    const client = await MongoClient.connect(mongoURI);
    const db = await client.db('khotab_data');
    cachedDb = db;
    return db;
}

exports.handler = async () => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('entries');
        const entries = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return {
            statusCode: 200,
            body: JSON.stringify(entries),
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};