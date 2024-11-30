const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/api/google-reviews', async (req, res) => {
    try {
        const placeId = 'ChIJkbhytOT5PzsRaPa_AnDL3bA'; // Your Place ID
        const apiKey = 'AIzaSyA5-hxCYDXx9Lrx1ZIkBW5cBDdc0hi8-Lg'; // Your API Key

        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
            params: {
                place_id: placeId,
                fields: 'reviews,rating,user_ratings_total',
                key: apiKey
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});