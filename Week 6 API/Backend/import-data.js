import pg from 'pg';
import { readFile } from 'fs/promises';

const pool = new pg.Pool({
    user: 'amilian',  
    host: 'localhost',
    database: 'bookshelf',
    password: 'Sagemodex7.',
    port: 5432
});

async function importData() {
    try {
        const data = JSON.parse(
            await readFile(new URL('./data.json', import.meta.url))
        );

        for (const book of data) {
            await pool.query(
                `INSERT INTO books (
                    title, 
                    author, 
                    "ISBN-10"
                ) VALUES ($1, $2, $3)`,
                [
                    book.title,
                    book.author,
                    book["ISBN-10"]
                ]
            );
        }
        console.log('Data imported successfully!');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        pool.end();
    }
}

importData();