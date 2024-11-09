// database.cjs

const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => console.log("Connected to PostgreSQL database."))
    .catch(err => console.error("Failed to connect to the database:", err));

// Create tables if they don't exist
const setupDatabase = async () => {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS Users (
                telegram_id BIGINT PRIMARY KEY,
                email VARCHAR(255),
                points INTEGER DEFAULT 0,
                referrer_id BIGINT
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS Referrals (
                id SERIAL PRIMARY KEY,
                referrer_id BIGINT REFERENCES Users(telegram_id),
                referred_user_id BIGINT REFERENCES Users(telegram_id)
            );
        `);

        console.log("Tables created or already exist.");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};

setupDatabase();

module.exports = client;
