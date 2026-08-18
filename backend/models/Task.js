const mongoose = require("mongoose");

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["todo", "in-progress", "done"];

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [120, "Title must be 120 characters or fewer"],
  },
  description: {
    type: String,
    default: "",
    trim: true,
    maxlength: [1000, "Description must be 1000 characters or fewer"],
  },
  priority: {
    type: String,
    enum: {
      values: PRIORITIES,
      message: `Priority must be one of: ${PRIORITIES.join(", ")}`,
    },
    default: "medium",
  },
  status: {
    type: String,
    enum: {
      values: STATUSES,
      message: `Status must be one of: ${STATUSES.join(", ")}`,
    },
    default: "todo",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

taskSchema.statics.PRIORITIES = PRIORITIES;
taskSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model("Task", taskSchema);
