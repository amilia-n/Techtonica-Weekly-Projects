import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 8080;

// Database config
const pool = new Pool({
    user: 'amilian',  
    host: 'localhost',
    database: 'bookshelf',
    password: 'Sagemodex7.',
    port: 5432
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// CRUD
app.get("/books", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM books ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/books/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM books WHERE id = $1",
            [req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching book:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/books", async (req, res) => {
    const { "ISBN-10":isbn10, title, author } = req.body;
    
// Debug logging
    console.log('Received request body:', req.body);
    
// Input validation
    if (!title || !author) {
        console.log('Validation failed:', { "ISBN-10":isbn10, title, author });
        return res.status(400).json({ 
            message: "ISBN-10, title, and author are required"
        });
    }
    
    try {
        console.log('Attempting database insert:', { "ISBN-10": isbn10, title, author });
  
        const result = await pool.query(
          'INSERT INTO books ("ISBN-10", title, author) VALUES ($1, $2, $3) RETURNING *',
          [isbn10, title, author]
      );

        console.log('Database insert successful:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Detailed database error:", {
            message: err.message,
            code: err.code,
            detail: err.detail
        });
        res.status(500).json({ 
            message: "Internal server error", 
            detail: err.message 
        });
    }
});

app.put("/books/:id", async (req, res) => {
    const { "ISBN-10": isbn10, title, author } = req.body;
    
    try {
      const result = await pool.query(
          'UPDATE books SET "ISBN-10" = $1, title = $2, author = $3 WHERE id = $4 RETURNING *',
          [isbn10, title, author, req.params.id]
      );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating book:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/books/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM books WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Error handling
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.url} not found` });
});

app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
});

// START SERVER :D
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});