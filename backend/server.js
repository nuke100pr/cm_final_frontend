const express = require("express");
const userRoutes = require("./routes/userRoutes");
const boardRoutes = require("./routes/boardRoutes");
const clubRoutes = require("./routes/clubRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");
const connectDB = require("./db"); // Import the MongoDB connection
const messageRoutes = require("./routes/messageRoutes");
const forumRoutes = require("./routes/forumRoutes");
const forumRoutes2 = require("./routes/forumRoutes2");
const eventRoutes = require("./routes/eventRoutes");
const eventAndRsvpRoutes = require("./routes/eventAndRsvpRoutes");
const projectRoutes = require("./routes/projectRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const blogRoutes = require("./routes/blogRoutes");
const statRoutes = require("./routes/statRoutes");
const porRoutes = require("./routes/porRoutes");

const app = express();
app.use(cors());

// Middleware
app.use(express.json());

// Serve static files from the uploads folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/forums", forumRoutes);
app.use("/forums2", forumRoutes2);
// app.use('/events', eventRoutes);

app.use("/events", eventAndRsvpRoutes);
app.use("/projects", projectRoutes);
app.use("/resources", resourceRoutes);
app.use("/opportunities", opportunityRoutes);
app.use("/blogs", blogRoutes);
app.use("/clubs", clubRoutes);
app.use("/boards", boardRoutes);
app.use("/users", userRoutes);
app.use("/stats", statRoutes);
app.use("/por2", porRoutes);

// Start server
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
