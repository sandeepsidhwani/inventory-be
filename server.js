const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const PORT = process.env.PORT || 8401;

const app = express();

// Import routes
const router = require("./routers/router");

// Middleware
app.use(cors()); // Enable CORS for frontend access
app.use(bodyParser.json()); // Parse JSON request body
app.use("/uploads", express.static("uploads")); // Serve static files from uploads directory

// Use routes
app.use("/api", router);

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 5MB." });
    }
  }
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

// Start server
app.listen(PORT, () => {
  console.log("Server is running on port : " + PORT);
});

module.exports = app;
