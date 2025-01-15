const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/quizApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));

// Define Schema
const scoreSchema = new mongoose.Schema({
    studentName: {type: String},
    score: {type: Number},
    date: { type: Date, default: Date.now },
});

// Define Model
const Score = mongoose.model('Score', scoreSchema);

// Routes
app.post('/save-score', async (req, res) => {
    try {
        const { studentName, score } = req.body;
        const newScore = new Score({ studentName, score });
        await newScore.save();
        res.status(201).send({ message: 'Score saved successfully!' });
    } catch (error) {
        res.status(500).send({ error: 'Error saving score' });
    }
});

app.get('/get-scores', async (req, res) => {
    try {
        const scores = await Score.find();
        res.status(200).send(scores);
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving scores' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});