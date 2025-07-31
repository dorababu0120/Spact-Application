import PersonalTask from '../models/personalTask.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await PersonalTask.find({ user: req.user.userId, isTrashed: false });
    res.json({ status: true, tasks });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to fetch tasks" });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = await PersonalTask.create({
      user: req.user.userId,
      title: req.body.title,
      date: req.body.date,
      priority: req.body.priority,
      status: req.body.status || "todo",
      notes: req.body.notes || "",
    });
    res.status(201).json({ status: true, task });
  } catch (err) {
    res.status(400).json({ status: false, message: "Failed to create task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await PersonalTask.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { isTrashed: true },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }
    res.json({ status: true, message: "Task moved to trash" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to delete task" });
  }
};
