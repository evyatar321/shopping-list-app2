const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// התחברות ל-MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// הגדרת סכמה עבור פריט
const itemSchema = new mongoose.Schema({
    text: String,
    emoji: String
});

const Item = mongoose.model('Item', itemSchema);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// נתיבי API
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/items', async (req, res) => {
    const item = new Item({
        text: req.body.text,
        emoji: req.body.emoji
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'הפריט נמחק' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`השרת פועל בפורט ${PORT}`);
});
