const Task = require("../models/Task");
const ApiError = require("../middleware/ApiError");
const asyncHandler = require("../middleware/asyncHandler");

// GET /api/tasks
// Supports:
//   ?status=todo|in-progress|done
//   ?priority=low|medium|high
//   ?search=text        (case-insensitive partial match on title)
//   ?sort=priority|-priority|createdAt|-createdAt
//   ?page=1&limit=20    (basic pagination)
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, sort, page, limit } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: "i" };

  let query = Task.find(filter);

  // Sorting. Priority is sorted by a logical rank (low < medium < high)
  // rather than alphabetically, since alphabetical would put "high"
  // before "low" before "medium".
  if (sort === "priority" || sort === "-priority") {
    const rank = { low: 1, medium: 2, high: 3 };
    const tasks = await query;
    tasks.sort((a, b) => {
      const diff = rank[a.priority] - rank[b.priority];
      return sort === "-priority" ? -diff : diff;
    });
    return res.json({ success: true, count: tasks.length, data: tasks });
  }

  if (sort === "createdAt" || sort === "-createdAt") {
    query = query.sort(sort);
  } else {
    query = query.sort("-createdAt");
  }

  // Optional pagination (stretch goal). Only applied if the caller
  // passes page/limit; otherwise every matching task is returned.
  if (page || limit) {
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      query.skip(skip).limit(limitNum),
      Task.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      count: tasks.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: tasks,
    });
  }

  const tasks = await query;
  res.json({ success: true, count: tasks.length, data: tasks });
});

// GET /api/tasks/:id
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new ApiError(404, `Task not found with id ${req.params.id}`);
  }
  res.json({ success: true, data: task });
});

// POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status } = req.body;

  if (!title || !title.trim()) {
    throw new ApiError(400, "Title is required");
  }

  const task = await Task.create({ title, description, priority, status });
  res.status(201).json({ success: true, data: task });
});

// PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status } = req.body;

  if (title !== undefined && !title.trim()) {
    throw new ApiError(400, "Title cannot be empty");
  }

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, priority, status },
    { new: true, runValidators: true, omitUndefined: true }
  );

  if (!task) {
    throw new ApiError(404, `Task not found with id ${req.params.id}`);
  }

  res.json({ success: true, data: task });
});

// DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    throw new ApiError(404, `Task not found with id ${req.params.id}`);
  }
  res.json({ success: true, data: {} });
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
