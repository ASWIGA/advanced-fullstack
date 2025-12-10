const express = require('express');
const mongoose = require('mongoose');
const foodmodel = require('./models/food');
const app = express();
const PORT = 8000;
require('dotenv').config();

const cors = require('cors');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// INSERT
app.post("/insert", async (req, res) => {
    const { foodName, daySinceAte } = req.body; // MUST match schema

    const food = new foodmodel({
        foodName: foodName,
        daySinceAte: daySinceAte
    });

    try {
        await food.save();
        res.status(201).send("Data Inserted successfully");
    } catch (err) {
        res.status(500).send("Error inserting food item");
    }
});

// READ
app.get("/read", async (req, res) => {
    try {
        const data = await foodmodel.find({});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).send("Error retrieving food items");
    }
});

// UPDATE
app.put("/update", async (req, res) => {
    const { id, newFoodName } = req.body;

    try {
        await foodmodel.findByIdAndUpdate(id, { foodName: newFoodName });
        res.status(200).send("Food Item Updated");
    } catch (err) {
        res.status(500).send("Error updating food item");
    }
});

// DELETE
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await foodmodel.findByIdAndDelete(id);
        res.status(200).send("Food Item Deleted successfully");
    } catch (err) {
        res.status(500).send("Error deleting food item");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
