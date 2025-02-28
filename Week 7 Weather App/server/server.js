import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Weather App Backend Running!');
// });

app.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "API Key is missing" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            res.json(data);
        } else {
            res.status(response.status).json({ error: data.message });
        }
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
