/* global process */
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "127.0.0.1";

// Middleware
app.use(cors());
app.use(express.json());

// Step 1: Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Root fallback route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Student Assignment Tracker API Server is running",
    healthCheck: "/health",
  });
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Health check available at http://${HOST}:${PORT}/health`);
});

export default app;
