const express = require("express");
const router = express.Router();
const Task = require("../models/task");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// ADD a task
router.post("/", async (req, res) => {
  const { title } = req.body;

  try {
    let task = new Task({ title });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Other routes like DELETE, UPDATE can be added similarly

// In routes/tasks.js

router.put("/:id", async (req, res) => {
  const { title, completed } = req.body;

  // Build a task object based on the fields that are being updated
  const taskFields = {};
  if (title) taskFields.title = title;
  if (completed !== undefined) taskFields.completed = completed;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// In routes/tasks.js

router.delete("/:id", async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    await Task.findByIdAndRemove(req.params.id);

    res.json({ msg: "Task removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
