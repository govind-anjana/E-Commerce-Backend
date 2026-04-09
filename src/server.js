// src/Server.js
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 8000;

// Connect Database
connectDB();

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
