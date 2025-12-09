const express = require('express');
const mongoose = require('mongoose');
const foodmodel = require('./models/food');
const app = express();
const PORT = process.env.PORT || 8000;
require('dotenv').config();

const cors = require('cors');

app.use(cors());
app.use(express.json());


app.post("/insert", async (req,res)=>{
    const foodName = req.body.foodName;
    const daySinceIate = req.body.daySinceIate;
    const food = new foodmodel({foodName: foodName, daySinceIate: daySinceIate});
    try{
        await food.save();
        res.status(201).send("Data Inserted sucessfully");
    }catch(err){
        res.status(500).send("Error inserting food item");
    }
});

app.get("/read", async (req,res)=>{
    try{
        const foodItems = await foodmodel.find({});
        res.status(200).json(foodItems);
    }catch(err){
        res.status(500).send("Error retrieving food items");        
    }
});

app.put("/update/", async (req,res)=>{
    const newFoodName = req.body.newFoodName
    const id = req.body.id;
    try{
        await foodmodel.findByIdAndUpdate(id,{foodName: newFoodName});
        res.status(200).send("Food Item Updated");
    }catch(err){
        res.status(500).send("Error updating food item");   
    }
});


app.delete("/delete/:id", async (req,res)=>{
    const id = req.params.id;
    try{
        await foodmodel.findByIdAndDelete(id);  
        res.status(200).send("Food Item Deleted sucessfully");
    }catch(err){
        res.status(500).send("Error deleting food item");   
    }
});

mongoose.connect(process.env.MONGODB_URL);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});