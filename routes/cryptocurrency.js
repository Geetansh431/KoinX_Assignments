import express from 'express';
import { fetchCryptocurrencyData } from '../controllers/cryptocurrencyController.js'; // Adjust path if needed
import { getCryptoStats } from "../controllers/cryptocurrencyController.js"

const router = express.Router();

router.get('/update-crypto-data', fetchCryptocurrencyData);
router.get('/stats',getCryptoStats)
export default router;
