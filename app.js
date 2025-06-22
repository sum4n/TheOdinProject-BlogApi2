const express = require("express");
const app = express();

app.use(express.json());

// Import routes
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

// use Routes
app.use("/api", authRouter);
app.use("/api", postsRouter);
app.use("/api", commentsRouter);

// Handle route not found
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error stack", err.stack);

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("app is running on port: ", PORT));
