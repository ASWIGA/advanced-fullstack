const express = require('express');
const mongoose = require('mongoose');
const TaskModel = require('./models/task');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001

app.use(cors());
app.use(express.json());


// ⭐ CREATE (Insert Task)
app.post("/insert", async (req, res) => {
    const taskName = req.body.taskName;
    const isCompleted = req.body.isCompleted;    // true or false

    const task = new TaskModel({
        taskName: taskName,
        isCompleted: isCompleted
    });

    try {
        await task.save();
        res.status(201).send("Task Inserted Successfully");
    } catch (err) {
        res.status(500).send("Error inserting task");
    }
});


// ⭐ READ (Get All Tasks)
app.get("/read", async (req, res) => {
    try {
        const tasks = await TaskModel.find({});
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).send("Error retrieving tasks");
    }
});


// ⭐ UPDATE (Task Name or Completed Status)
app.put("/update", async (req, res) => {
    const id = req.body.id;
    const newTaskName = req.body.newTaskName;
    const newIsCompleted = req.body.newIsCompleted;  // true or false

    try {
        await TaskModel.findByIdAndUpdate(id, {
            taskName: newTaskName,
            isCompleted: newIsCompleted
        });
        res.status(200).send("Task Updated Successfully");
    } catch (err) {
        res.status(500).send("Error updating task");
    }
});


// ⭐ DELETE (Delete Task)
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await TaskModel.findByIdAndDelete(id);
        res.status(200).send("Task Deleted Successfully");
    } catch (err) {
        res.status(500).send("Error deleting task");
    }
});


// MongoDB connection
mongoose.connect(process.env.MONGODB_URL);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
