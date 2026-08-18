const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "*",
    })
  );
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Task & Bug Tracker API is running" });
  });

  app.use("/api/tasks", taskRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
