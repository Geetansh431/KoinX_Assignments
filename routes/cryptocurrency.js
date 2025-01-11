import express from 'express';
import { fetchCryptocurrencyData } from '../controllers/cryptocurrencyController.js'; // Adjust path if needed
import { getCryptoStats } from "../controllers/cryptocurrencyController.js"
import Price from '../models/price.js';
const router = express.Router();

const calculateStandardDeviation = (prices) => {
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance);
  };

router.get('/update-crypto-data', fetchCryptocurrencyData);
router.get('/stats', getCryptoStats)
router.get("/deviation", async (req, res) => {
    try {
        const { coin } = req.query;

        if (!coin) {
            return res.status(400).json({ error: "Please provide a valid coin parameter." });
        }

        // Fetch all available price records for the requested coin
        const prices = await Price.find({ coin }).sort({ timestamp: -1 });

        if (prices.length === 0) {
            return res.status(404).json({ error: "No records found for the requested coin." });
        }

        const priceValues = prices.map((record) => record.price);

        // Calculate Standard Deviation
        const deviation = calculateStandardDeviation(priceValues);

        res.json({ deviation: deviation.toFixed(2) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});


export default router;
