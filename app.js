const express = require("express");
const app = express();

app.use(express.json());

// Import routes
const authRouter = require("./routes/auth");

// use Routes
app.use("/api", authRouter);

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
