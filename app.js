import express from "express";
import cors from "cors";
import cryptocurrencyRoutes from "./routes/cryptocurrency.js"; // Adjust path if needed

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Use the cryptocurrency routes
app.use('/api/cryptocurrency', cryptocurrencyRoutes);

export { app };
