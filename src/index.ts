import express from 'express';
import 'dotenv/config'
import Anthropic from '@anthropic-ai/sdk';
const { Pool } = require('pg');



const app = express();
const port = 3000;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ecommerce_analytics",
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
})


async function getAllCustomers() {
    try {
        const { rows } = await pool.query('SELECT * FROM customers');
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
}

// Execute the function
getAllCustomers()
    .then(customers => {
        console.log(`Retrieved ${customers.length} customers`);
    })
    .catch(err => {
        console.error('Failed to get customers:', err);
    })


    app.get('/customers', async (req, res) => {
        try {
            const { rows } = await pool.query('SELECT * FROM customers');
            res.json(rows);
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ error: 'Database error' });
        }
    });



const anthropic = new Anthropic({
    apiKey: `${process.env.API_KEY}`,
});
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});




app.get("/ask", async () => {
    const msg = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1024,
        messages: [{ role: "user", content: "" }],
    });
    console.log(msg);
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});







