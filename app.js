import express from "express";
import cors from "cors";
import cryptocurrencyRoutes from "./routes/cryptocurrency.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cryptocurrency', cryptocurrencyRoutes);

export { app };
