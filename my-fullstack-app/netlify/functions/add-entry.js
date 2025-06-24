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

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    try {
        const data = JSON.parse(event.body);
        const db = await connectToDatabase();
        const collection = db.collection('entries');
        
        const entry = {
            preacher: data.الخطيب,
            month: data.الشهر,
            year: data.العام,
            mosques: data.mosques,
            dates: data.dates,
            createdAt: new Date(),
        };
        
        await collection.insertOne(entry);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Entry added successfully' }),
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};