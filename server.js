import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/users.js";
import expenseRoutes from "./routes/expense.js"

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch((err) => console.error("MongoDb connection error: ", err));

app.get("/", (req, res) => {
  res.send("Hello from the Express Server!");
});

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes)

app.listen(PORT, () => {
  console.log(`Server is running and listening on http://localhost:${PORT}`);
});
