const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('מחובר ל-MongoDB'))
  .catch(err => {
    console.error('שגיאה בהתחברות ל-MongoDB:', err.message);
    process.exit(1);
  });

const itemSchema = new mongoose.Schema({
  text: String,
  emoji: String
});

const Item = mongoose.model('Item', itemSchema);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/items', async (req, res) => {
  console.log('קיבלתי בקשה לקבלת פריטים');
  try {
    const items = await Item.find();
    console.log('נשלחים פריטים:', items);
    res.json(items);
  } catch (error) {
    console.error('שגיאה בקבלת פריטים:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  console.log('קיבלתי בקשה להוספת פריט:', req.body);
  const item = new Item({
    text: req.body.text,
    emoji: req.body.emoji
  });
  try {
    const newItem = await item.save();
    console.log('פריט חדש נשמר:', newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('שגיאה בשמירת פריט:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  console.log('קיבלתי בקשה למחיקת פריט:', req.params.id);
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'פריט לא נמצא' });
    }
    console.log('פריט נמחק:', deletedItem);
    res.json({ message: 'פריט נמחק', item: deletedItem });
  } catch (error) {
    console.error('שגיאה במחיקת פריט:', error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`השרת פועל בפורט ${PORT}`);
});
